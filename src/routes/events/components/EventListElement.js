import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import EventModel from '../../../modules/endpoint/models/EventModel'

import style from './EventListElement.css'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import RemoteContent from 'modules/common/components/RemoteContent'
import Timespan from '../../../modules/common/components/Timespan'

/**
 * Display a element of the EventList
 */
class EventListElement extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(EventModel).isRequired,
    parentUrl: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  /**
   * Generates the url of the specific event represented by this EventListElement
   * @returns {string} The url
   */
  getUrl () {
    return `${this.props.parentUrl}/${this.props.event.id}`
  }

  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder () {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % 3]
  }

  render () {
    const dateModel = this.props.event.dateModel

    return (
      <Link href={this.getUrl()} className={style.event}>
        <img className={style.eventThumbnail} src={this.props.event.thumbnail || this.getEventPlaceholder()} />
        <div className={style.eventDescription}>
          <div className={style.eventTitle}>{this.props.event.title}</div>
          <div className={style.eventDate}>
            <Timespan startDate={dateModel.startDate}
                      endDate={dateModel.endDate}
                      locale={this.props.language} />
            , {this.props.event.address}
          </div>
          <RemoteContent dangerouslySetInnerHTML={{__html: this.formatExcerpt(70)}} />
        </div>
      </Link>
    )
  }

  /**
   * Formats the excerpt to a given length
   * @param excerptLength The maximal length of the excerpt
   * @returns {string} The formatted excerpt
   */
  formatExcerpt (excerptLength) {
    return this.props.event.excerpt.slice(0, excerptLength) + '...'
  }
}

export default EventListElement