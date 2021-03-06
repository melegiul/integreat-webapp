// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { PoiModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import PageDetail from '../../../modules/common/components/PageDetail'
import PoiListItem from '../components/PoiListItem'
import Caption from '../../../modules/common/components/Caption'
import List from '../../../modules/common/components/List'
import { push } from 'redux-first-router'

type PropsType = {|
  pois: Array<PoiModel>,
  city: string,
  poiId: ?string,
  language: string,
  t: TFunction
|}

/**
 * Displays a list of pois or a single poi, matching the route /<city>/<language>/locations(/<id>)
 */
export class PoisPage extends React.Component<PropsType> {
  renderPoiListItem = (poi: PoiModel) => <PoiListItem key={poi.path} poi={poi} />

  render () {
    const { pois, poiId, city, language, t } = this.props
    if (poiId) {
      const poi = pois.find(_poi => _poi.path === `/${city}/${language}/locations/${poiId}`)

      if (poi) {
        const location = poi.location.location
        return (
          <Page defaultThumbnailSrc={poi.thumbnail}
                lastUpdate={poi.lastUpdate}
                content={poi.content}
                title={poi.title}
                language={language}
                onInternalLinkClick={push}>
            {location && <PageDetail identifier={t('location')} information={location} />}
          </Page>
        )
      } else {
        const error = new ContentNotFoundError({ type: 'poi', id: poiId, city, language })
        return <FailureSwitcher error={error} />
      }
    }

    const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))
    return <>
      <Caption title={t('pois')} />
      <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={this.renderPoiListItem} />
    </>
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  poiId: state.location.payload.poiId
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps)(
  withTranslation('pois')(
    PoisPage
  ))
