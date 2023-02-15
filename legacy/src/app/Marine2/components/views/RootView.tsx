import React from "react"
import MainLayout from "../ui/MainLayout"
import EnergyAC from "../boxes/EnergyAC"
import EnergyDC from "../boxes/EnergyDC"

const RootView = () => {
  return (
    <MainLayout>
      <>
        <EnergyAC mode="compact" className={"mb-2"} />
        <EnergyDC mode="compact" />
      </>
    </MainLayout>
  )
}

export default RootView
