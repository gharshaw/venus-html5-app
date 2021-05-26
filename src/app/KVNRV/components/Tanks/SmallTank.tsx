import React from "react"

import { Card, SIZE_NARROW, SIZE_SHORT } from "../../../components/Card"
import { NotAvailable } from "../NotAvailable"
import NumericValue, { formatNumber } from "../../../components/NumericValue"
import ProgressIndicator from "../../components/ProgressIndicator"

import "./SmallTank.scss"
import { useTank } from "../../../modules"
import { TankProps } from "./index"
import { useSendUpdate } from "../../../modules"
import { VOLUME_UNITS, VolumeUnit, VolumeUnits } from "../../utils/constants"

export const SmallTank = ({ tankId, conf, invert }: TankProps) => {
  const tank = useTank(tankId)
  const footer = useSendUpdate(
    invert ? 1 - tank.level / 100 : tank.level / 100,
    conf,
    tank.customName ?? tank.productName
  )

  const unit: VolumeUnit =
    tank?.unit && Object.keys(VOLUME_UNITS).includes(tank.unit.toString())
      ? VOLUME_UNITS[tank.unit.toString() as keyof VolumeUnits]
      : VOLUME_UNITS.default

  return (
    <div className="">
      <Card title={tank?.customName ?? tank.productName} size={[SIZE_SHORT, SIZE_NARROW]} footer={footer}>
        <div className="gauge">
          {tank ? (
            <div className={"small-tank"}>
              <div className="indicator-main--small">
                <span>
                  <NumericValue value={tank.level} unit="%" defaultValue={"--"} precision={0} />
                  <span className="name">
                    {formatNumber({ value: tank.remaining * unit.factor, unit: unit.unit, precision: unit.precision })}
                  </span>
                </span>
              </div>

              <ProgressIndicator percent={tank.level / 100} level={footer!.status} />
            </div>
          ) : (
            <NotAvailable />
          )}
        </div>
      </Card>
    </div>
  )
}
