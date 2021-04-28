import React  from "react"
import { Card, SIZE_SMALL } from "../Card"
import DonutIndicator from "../DonutIndicator"
import { useDcLoads } from "../../../modules/DcLoads"
import { DC_CONF } from "../../constants/constants"

import { NotAvailable } from "../NotAvailable"
import { CommonProps, STATUS_LEVELS } from "../Views/Metrics"

export const DcLoads = (props: CommonProps) => {
  const {voltage, power} = useDcLoads()

  let normalized_power = (power || 0) / DC_CONF.MAX
  normalized_power = Math.max(Math.min(normalized_power, 1), 0)

  // if (voltage &&  voltage > 20) {
  //   props.addStatusUpdate({level: STATUS_LEVELS.WARNING, part: "DC Loads", message: "Overheating"})
  // }

  return (
    <div className="">
      <Card title={'DC Loads'} size={SIZE_SMALL}>
        <div className="gauge">
          {power ? (
            <DonutIndicator value={power} percent={normalized_power} parts={DC_CONF.THRESHOLDS} unit={"W"} />
          ) : ( <NotAvailable /> )}

          <div className={"info-bar"}>
            <div className={"info-bar__cell"}>{(voltage || '--') + " A"}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DcLoads