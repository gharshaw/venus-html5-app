import React from "react"

import { useActiveInValues } from "../../../modules"

import { ListRow } from "../ListView"
import NumericValue from "../../../components/NumericValue"

type ActiveInValuesProps = {
  phases: number
}

const ActiveInValues = ({ phases }: ActiveInValuesProps) => {
  const { current, voltage, power } = useActiveInValues()
  if (current && voltage && power && phases) {
    return phases > 1 ? (
      <div>
        {voltage.slice(0, phases).map((v, i) => (
          <ListRow key={i}>
            <span className="value value__phase">L {i + 1}</span>
            <NumericValue value={v} unit="V" />
            <NumericValue value={current[i]} unit="A" precision={1} />
            <NumericValue value={power[i]} unit={"W"} />
          </ListRow>
        ))}
      </div>
    ) : (
      <div>
        <NumericValue value={voltage[0]} unit={"V"} />
        <NumericValue value={current[0]} unit="A" precision={1} />
        <NumericValue value={power[0]} unit="W" />
      </div>
    )
  } else {
    return <div></div>
  }
}

export default ActiveInValues