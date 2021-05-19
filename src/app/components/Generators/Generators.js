import React from "react"

import GeneratorFp from "./GeneratorFp"
import GeneratorRelay from "./GeneratorRelay"

const Generators = ({ portalId, inverterChargerDeviceId }) => (
  <>
    <GeneratorRelay
      portalId={portalId}
      autoStartStopTopic={`W/${portalId}/settings/0/Settings/Generator0/AutoStartEnabled`}
      manualStartStopTopic={`W/${portalId}/generator/0/Generator0/ManualStart`}
      inverterChargerDeviceId={inverterChargerDeviceId}
    />
    <GeneratorFp
      portalId={portalId}
      autoStartStopTopic={`W/${portalId}/settings/0/Settings/Services/FischerPandaAutoStartStop`}
      manualStartStopTopic={`W/${portalId}/genset/0/Start`}
    />
  </>
)

export default Generators