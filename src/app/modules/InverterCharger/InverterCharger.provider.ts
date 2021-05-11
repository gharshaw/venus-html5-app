import { mqttQuery, PortalId, Topics } from "../Mqtt"
import {
  useMqtt,
  useTopicsState,
  useTopicSubscriptions,
  useTopicsWithPortalIdAndInstanceId,
} from "../Mqtt/Mqtt.provider"
import { InstanceId, vebusQuery } from "../Vebus"
import { useObservableState } from "observable-hooks"

export interface InverterChargerState {
  state: number
  mode: number
  customName: number
  productName: number
  modeIsAdjustable: number
}

export interface InverterChargerTopics extends Topics {
  state?: string
  mode?: string
  customName?: string
  productName?: string
  modeIsAdjustable?: string
}

export interface InverterChargerProvider extends InverterChargerState {
  updateMode: () => void
}

export function useInverterCharger(): InverterChargerState {
  const getTopics = (portalId: PortalId, deviceInstanceId: InstanceId) => {
    return {
      state: `N/${portalId}/system/0/SystemState/State`,
      mode: `N/${portalId}/vebus/${deviceInstanceId}/Mode`,
      customName: `N/${portalId}/vebus/${deviceInstanceId}/CustomName`,
      productName: `N/${portalId}/vebus/${deviceInstanceId}/ProductName`,
      modeIsAdjustable: `N/${portalId}/vebus/${deviceInstanceId}/ModeIsAdjustable`,
    }
  }

  const topics$ = useTopicsWithPortalIdAndInstanceId<InverterChargerTopics>(
    getTopics,
    mqttQuery.portalId$,
    vebusQuery.instanceId$
  )

  useTopicSubscriptions(topics$)

  const getWriteTopics = (portalId: PortalId, deviceInstanceId: InstanceId) => ({
    mode: `W/${portalId}/vebus/${deviceInstanceId}/Mode`,
  })

  const writeTopics$ = useTopicsWithPortalIdAndInstanceId(getWriteTopics, mqttQuery.portalId$, vebusQuery.instanceId$)
  const writeTopics = useObservableState(writeTopics$)

  const mqtt = useMqtt()
  const updateMode = (mode: string) => mqtt.publish(writeTopics!.mode, mode)

  return { ...useTopicsState<InverterChargerState>(topics$), updateMode } as InverterChargerProvider
}
