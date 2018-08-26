// @flow

import React from 'react'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import RemoteContent from 'modules/common/components/RemoteContent'
import TimeSpan from './TimeSpan'
import Link from 'redux-first-router-link'
import EventModel from '../../../modules/endpoint/models/EventModel'
import { goToEvents } from '../../../modules/app/routes/events'
import styled from 'styled-components'

const EXCERPT_LENGTH = 70

type PropsType = {
  event: EventModel,
  city: string,
  language: string
}

const EventLink = styled(Link)`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
`

const EventThumbnail = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
`

const EventDescription = styled.div`
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  margin-left: 15px;
  padding: 15px 0;
  word-wrap: break-word;
`

const EventTitle = styled.div`
  font-weight: 700;
`

const EventDate = styled.div`
  padding-bottom: 10px;
`

/**
 * Display a element of the EventList
 */
class EventListElement extends React.Component<PropsType> {
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder (): string {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % placeholders.length]
  }

  render () {
    const {city, language, event} = this.props
    return (
      <EventLink to={goToEvents(city, language, event.id)}>
        <EventThumbnail src={event.thumbnail || this.getEventPlaceholder()} />
        <EventDescription>
          <EventTitle>{event.title}</EventTitle>
          <EventDate>
            <TimeSpan startDate={event.startDate}
                      endDate={event.endDate}
                      allDay={event.allDay}
                      locale={language} />
            , {event.address}
          </EventDate>
          <RemoteContent dangerouslySetInnerHTML={{__html: this.formatExcerpt(EXCERPT_LENGTH)}} />
        </EventDescription>
      </EventLink>
    )
  }

  /**
   * Formats the excerpt to a given length
   * @param excerptLength The maximal length of the excerpt
   * @returns {string} The formatted excerpt
   */
  formatExcerpt (excerptLength: number): string {
    return `${this.props.event.excerpt.slice(0, excerptLength)}...`
  }
}

export default EventListElement
