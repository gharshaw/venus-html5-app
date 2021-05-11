import React from "react"
import DcIcon from "../../images/icons/dc.svg"
import { useDcLoads } from "../../../modules/DcLoads"
import HeaderView from "../HeaderView"
import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

export const DcLoads = () => {
  const { voltage, power } = useDcLoads()

  return (
    <ColumnContainer>
      <HeaderView icon={DcIcon} title="DC Loads" showBoat>
        <MetricValues>
          <NumericValue value={voltage && power ? power / voltage : undefined} unit="A" precision={1} />
          <NumericValue value={power} unit="W" />
        </MetricValues>
      </HeaderView>
    </ColumnContainer>
  )
}

export default DcLoads
