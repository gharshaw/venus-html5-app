import { observer } from "mobx-react-lite"
import GeneratorIcon from "../../../images/icons/generator.svg"
import { translate } from "react-i18nify"
import { formatPower } from "../../../utils/format"
import DeviceCompact from "../DeviceCompact"
import { useActiveInValues } from "@elninotech/mfd-modules"

const GeneratorRelay = ({
  statusCode,
  active,
  phases = 1,
  manualStart,
  autoStart,
  relayFunction,
  updateManualMode,
  updateAutoMode,
  mode = "compact",
}: Props) => {
  const getGeneratorState = (statusCode: number, active: boolean, phases: number) => {
    if (active) {
      return phases > 1 ? translate("common.nrOfPhases", { phases }) : translate("common.running")
    }

    switch (statusCode) {
      case 1:
        return translate("common.running")
      case 10:
        return translate("common.error")
      default:
        return translate("common.stopped")
    }
  }

  // When a topic is invalid, it returns undefined -> no value means topic is not supported
  const title = translate("widgets.generator")
  const subTitle = getGeneratorState(statusCode, active ?? false, phases)

  const { current, voltage, power } = useActiveInValues()
  const powerSum = active
    ? power.reduce((sum: number, b) => {
        return b ? sum + b : sum
      }, 0)
    : 0
  const powerFormatted = formatPower(powerSum)
  const unit = powerSum > 1000 ? "kW" : "W"

  if (mode === "compact") {
    return (
      <DeviceCompact
        icon={
          <GeneratorIcon
            /* todo: fix types for svg */
            /* @ts-ignore */
            className={"w-7"}
          ></GeneratorIcon>
        }
        title={title}
        subTitle={subTitle}
        value={powerFormatted}
        unit={unit}
      />
    )
  }

  return <div className={"flex flex-row items-center justify-between w-full"}></div>
}

interface Props {
  statusCode: number
  phases?: number
  manualStart: number
  autoStart: number
  relayFunction: number
  updateManualMode: Function
  updateAutoMode: Function
  active?: boolean
  mode?: "compact" | "full"
}

export default observer(GeneratorRelay)
