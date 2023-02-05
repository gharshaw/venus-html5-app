import React from 'react'
import Box from '~/components/ui/Box'
import { BoxProps } from '~/types/boxes'
import { AcLoadsState } from '@elninotech/mfd-modules'
import { useTranslation } from 'next-i18next'
import ACIcon from '~/public/icons/ac.svg'

const EnergyAC = ({ mode = 'compact', acLoads }: Props) => {
  const { current, power, phases, voltage } = acLoads

  const totalPower = power.reduce((total, power) => (power ? total + power : total))
  const { t } = useTranslation()

  const formatPower = (power: number) => {
    if (power >= 1000) {
      return (power / 1000).toFixed(1)
    }

    return power.toFixed(1)
  }

  if (mode === 'compact') {
    return (
      <div className='flex flex-row justify-between items-center'>
        <div className='flex'>
          <ACIcon className={'w-7 text-black dark:text-white'} />
          <p className='text-2xl pl-3'>{t('boxes.acLoads')}</p>
        </div>
        <p className='text-2xl'>
          {(phases ?? 1) === 1 && (
            <p>
              {current[0] ? current[0].toFixed(1) : '--'}
              <span className='text-victron-gray dark:text-victron-gray-dark'> A</span>
            </p>
          )}
          {(phases ?? 1) !== 1 && (
            <p>
              {formatPower(totalPower) ?? '--'}
              <span className='text-victron-gray dark:text-victron-gray-dark'>{totalPower > 1000 ? " kW" : " W"}</span>
            </p>
          )}
        </p>
      </div>
    )
  }

  return (
    <Box title={t('boxes.acLoads')} icon={<ACIcon className={'w-5 text-black dark:text-white'} />}>
      <div className='w-full h-full py-2 flex flex-col'>
        <div className='text-6xl text-victron-gray dark:text-white'>
          {formatPower(totalPower)}
          <span className='text-victron-gray2 dark:text-victron-gray2-dark'>{totalPower > 1000 ? "kW" : "W"}</span>
        </div>
        <div className='w-full h-full flex content-end flex-wrap'>
          {Array.from(Array(phases ?? 1).keys()).map((i) => (
            <div key={i} className='w-full grid grid-cols-7 p-1 md:grid-cols-10'>
              <hr className='col-span-10 h-1 p-1 border-victron-gray2 dark:border-victron-gray2-dark' />
              <p className='col-span-1 text-2xl text-victron-gray dark:text-victron-gray-dark'>{'L' + (i + 1)}</p>
              <div className='col-span-3 text-left text-2xl text-victron-gray dark:text-victron-gray-dark'>
                {voltage[i] ? voltage[i].toFixed(1) : '--'}
                <span className='text-victron-gray2 dark:text-victron-gray2-dark'> V</span>
              </div>
              <div className='col-span-3 text-center text-2xl text-victron-gray dark:text-victron-gray-dark'>
                {current[i] ? current[i].toFixed(1) : '--'}
                <span className='text-victron-gray2 dark:text-victron-gray2-dark'> A</span>
              </div>
              <div className='hidden text-right text-2xl text-victron-gray dark:text-victron-gray-dark md:col-span-3 md:block'>
                {power[i] ? formatPower(power[i]) : '--'}
                <span className='text-victron-gray2 dark:text-victron-gray2-dark'>{power[i] > 1000 ? " kW" : " W"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Box>
  )
}

interface Props extends BoxProps {
  acLoads: AcLoadsState
}

export default EnergyAC
