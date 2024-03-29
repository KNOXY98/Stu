// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useInterval } from 'gatsby-plugin-tractstack'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'
import { pushPayload } from '../api/services'
import Controller from './Controller'
import StoryFragmentRender from './storyFragmentRender'
import '../styles/storyfragment.css'
import { IStoryFragmentProps } from '../types'

interface IStyledWrapperSectionProps {
  css: any
}
const StyledWrapperSection = styled.section<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`

const StoryFragment = ({ viewportKey, payload }: IStoryFragmentProps) => {
  const lookup = `${viewportKey}-${payload.id}`
  const storyFragment = payload.storyFragment[lookup]
  const tractStackId = payload.tractStackId
  const contentMap = payload.contentMap
  const panesVisible = useStoryStepStore((state) => state.panesVisible)
  const updateEventStreamCleanup = useStoryStepStore(
    (state) => state.updateEventStreamCleanup,
  )
  const gotoLastPane = useStoryStepStore((state) => state.gotoLastPane)
  const setGotoLastPane = useStoryStepStore((state) => state.setGotoLastPane)
  const eventStream = useStoryStepStore((state) => state.eventStream)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const lastSync = useAuthStore((state) => state.lastSync)
  const setLastSync = useAuthStore((state) => state.setLastSync)
  const forceSync =
    isLoggedIn &&
    typeof eventStream === `object` &&
    Object.keys(eventStream).length > 0 &&
    (!lastSync || Date.now() - lastSync > config.conciergeSync * 2)
  const impressions =
    typeof storyFragment !== `undefined` ? storyFragment.impressions : null
  const thisCss = storyFragment?.css || ``
  const impressionPanes: any[] = []
  Object.keys(panesVisible).forEach((key) => {
    if (typeof panesVisible[key] === `number` && impressions?.key) {
      if (panesVisible.last === key) impressionPanes.unshift(key)
      else impressionPanes.push(key)
    }
  })

  useEffect(() => {
    if (forceSync) {
      const now = Date.now()
      pushPayload({ eventStream, contentMap, tractStackId }).finally(() => {
        updateEventStreamCleanup(now)
        setLastSync(now)
      })
    }
  }, [
    forceSync,
    eventStream,
    contentMap,
    tractStackId,
    updateEventStreamCleanup,
    setLastSync,
  ])

  useInterval(() => {
    if (
      typeof eventStream === `object` &&
      Object.keys(eventStream).length > 0
    ) {
      const now = Date.now()
      pushPayload({ eventStream, contentMap, tractStackId }).finally(() => {
        updateEventStreamCleanup(now)
        setLastSync(now)
      })
    }
  }, config.conciergeSync)

  useEffect(() => {
    if (gotoLastPane) {
      const lastPane = document.getElementById(`${viewportKey}-${gotoLastPane}`)
      if (lastPane) {
        lastPane.scrollIntoView()
        setGotoLastPane()
      }
    }
  }, [viewportKey, gotoLastPane, setGotoLastPane])

  return (
    <>
      <main>
        <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
          <StoryFragmentRender viewportKey={viewportKey} payload={payload} />
        </StyledWrapperSection>
      </main>
      {impressionPanes.length > 0 ? (
        <aside id="controller">
          <Controller
            impressions={impressions}
            impressionPanes={impressionPanes}
            viewportKey={viewportKey}
            contentMap={contentMap}
          />
        </aside>
      ) : null}
    </>
  )
}

export default StoryFragment
