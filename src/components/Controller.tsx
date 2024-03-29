// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { concierge, lispLexer, useInterval } from 'gatsby-plugin-tractstack'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'
import { IImpressionProps, IControllerProps } from '../types'

const impressionsDelay = config.impressionsDelay

const Impression = ({ payload }: IImpressionProps) => {
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const thisButtonPayload = lispLexer(payload.actionsLisp)

  function injectPayload() {
    const now = Date.now()
    const eventPayload = {
      verb: `clicked`,
      id: payload.id,
      title: payload.title,
      type: `Impression`,
      targetId: payload.parentId,
    }
    updateEventStream(now, eventPayload)
    concierge(thisButtonPayload, {
      processRead,
    })
  }

  if (typeof payload !== `object`) return <></>
  return (
    <>
      <h3 className="text-rlg sm:text-lg font-medium leading-6 text-allblack">
        {payload.title}
      </h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-rsm sm:text-sm text-darkgrey">
          <p>
            {payload.body}
            {` `}
            <button
              type="button"
              onClick={injectPayload}
              className="underline underline-offset-4 text-allblack hover:orange"
            >
              {payload.buttonText}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

const Controller = ({
  impressions,
  impressionPanes,
  viewportKey,
}: IControllerProps) => {
  const [offset, setOffset] = React.useState(0)
  const [open, setOpen] = React.useState(true)

  useInterval(() => {
    if (impressionPanes.length > offset + 1) setOffset(offset + 1)
    else setOffset(0)
  }, impressionsDelay)
  if (typeof impressions === `undefined`) return null
  const offsetImpression: any =
    impressions && typeof impressionPanes[offset] !== `undefined`
      ? impressions[impressionPanes[offset]]
      : impressions
      ? impressions[impressionPanes[0]]
      : null
  const thisImpression: any =
    typeof offsetImpression === `object` &&
    typeof offsetImpression[0] === `object`
      ? offsetImpression[0]
      : null
  if (!thisImpression) return null
  if (open)
    return (
      <aside id="controller" className="mr-1">
        <div
          className={`z-70010 overflow-hidden bg-neutral-200 rounded-md border border-darkgrey controller__expanded controller__expanded--${viewportKey}`}
        >
          <div className="px-4 pt-4">
            <button
              type="button"
              className="z-70020 absolute right-2 top-2 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">Hide controller</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Impression payload={thisImpression} />
          </div>
        </div>
      </aside>
    )
  return (
    <div
      className={`z-70010 relative controller__minimized controller_minimized--${viewportKey}`}
    >
      <button
        type="button"
        className="z-70020 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Show controller</span>
        <ArrowsPointingOutIcon className="h-8 w-8" aria-hidden="true" />
        <span className="z-70030 absolute -top-5 -left-4 h-6 w-6 rounded-full bg-allwhite text-black flex justify-center items-center items">
          {impressionPanes.length}
        </span>
      </button>
    </div>
  )
}

export default Controller
