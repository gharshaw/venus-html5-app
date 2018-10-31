import * as mqtt from "mqtt"
import { TOPICS } from "./topics"
import { DBUS_PATHS } from "../config/dbusPaths"
import { parseMessage, arrayToSubscriptionMap } from "./util"
import VenusSystem from "./venusSystem"

// For development when there is no Venus device available with demo mode on
// we can use this mock mqtt client that mocks the mqtt server responses to
// the ui. Implemented using webpack define plugin to define whether or not
// we are in prod or dev mode.

import MockMqttClient from "./MockMqttClient"

/**
 * Default quality of service when subscribing - best effort
 * {@link https://www.npmjs.com/package/mqtt#qos}
 */
const TOPICS_TO_SUBSCRIBE_ON_INIT = [
  TOPICS.NOTIFICATION.SERIAL,
  TOPICS.NOTIFICATION.ALL_DEVICE_INSTANCES,
  TOPICS.NOTIFICATION.SETTINGS_AC_INPUT_TYPE1,
  TOPICS.NOTIFICATION.SETTINGS_AC_INPUT_TYPE2
]

const subscribeCallback = (err, granted) => {
  if (err) {
    console.log("Error connecting to topic", err)
  } else {
    granted.forEach(grant => {
      console.log(`Subscribed to ${grant.topic} with qos ${grant.qos}...`)
    })
  }
}

class VenusClient {
  /**
   * @type {MockMqttClient|MqttClient}
   */
  mqttClient
  /**
   * @type {VenusSystem}
   * @private
   */
  venusSystem
  onMessage = () => {}
  onConnectionChanged = () => {}

  constructor(host) {
    this.mqttClient = USE_MOCK_MQTT
      ? new MockMqttClient()
      : mqtt.connect(
          host,
          { keepalive: 10 }
        )
    this.venusSystem = new VenusSystem()
    window.onunload = () => {
      this.mqttClient.end()
    }
  }

  connect = () => {
    return new Promise((resolve, reject) => {
      this.mqttClient.once("connect", () => {
        const initialSubs = arrayToSubscriptionMap(TOPICS_TO_SUBSCRIBE_ON_INIT)
        this.mqttClient.subscribe(initialSubs, (err, granted) => {
          subscribeCallback(err, granted)
          if (err) {
            reject(err)
          }
        })
      })

      this.mqttClient.on("connect", () => {
        this.onConnectionChanged({ connected: true })
      })

      this.mqttClient.on("disconnect", () => {
        this.onConnectionChanged({ connected: false })
      })

      this.mqttClient.on("reconnect", () => {
        this.onConnectionChanged({ connected: false })
      })

      this.mqttClient.on("end", () => {
        this.onConnectionChanged({ connected: false })
      })

      this.mqttClient.on("close", () => {
        this.onConnectionChanged({ connected: false })
      })

      this.mqttClient.on("offline", () => {
        this.onConnectionChanged({ connected: false })
      })

      this.mqttClient.on("message", (topic, data) => {
        // Listen to messages but do nothing until system is initialized
        // Then remove all initial subscriptions and resolve the promise,
        // after which the app can subscribe to paths it needs
        const message = parseMessage(topic, data)
        this.venusSystem.handleSystemMessage(topic, message)
        if (this.venusSystem.isInitialized()) {
          this.mqttClient.unsubscribe(TOPICS_TO_SUBSCRIBE_ON_INIT)
          this.mqttClient.removeAllListeners("message")
          resolve()
        }
      })
    })
  }

  write(dbusPath, value) {
    const topic = this.venusSystem.getTopicFromDbusPath("W", dbusPath)
    let data = JSON.stringify({ value: value })
    console.log("Write: ", topic, data)
    this.mqttClient.publish(topic, data)
  }

  subscribe = dbusPaths => {
    this.mqttClient.on("message", (topic, message) => {
      const clientMessage = parseMessage(topic, message)
      // console.log("Received message:", topic, clientMessage.value)
      this.onMessage(clientMessage)
    })

    const topics = dbusPaths.map(dbusPath => this.venusSystem.getTopicFromDbusPath("N", dbusPath))
    const subscribeMap = arrayToSubscriptionMap(topics)
    this.mqttClient.subscribe(subscribeMap, subscribeCallback)
  }
}

export default VenusClient