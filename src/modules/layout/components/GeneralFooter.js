// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'

import Footer from './Footer'
import MainDisclaimerRouteConfig from '../../app/route-configs/MainDisclaimerRouteConfig'
import CleanAnchor from '../../common/components/CleanAnchor'
import CleanLink from '../../common/components/CleanLink'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  t: TFunction
|}

class GeneralFooter extends React.PureComponent<PropsType> {
  render () {
    const { t } = this.props
    return (
      <Footer>
        <CleanLink to={new MainDisclaimerRouteConfig().getRoutePath()}>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href='https://integreat-app.de/about/'>
          {t('settings:about', { appName: buildConfig().appName })}
        </CleanAnchor>
        <CleanAnchor href='https://integreat-app.de/datenschutz/'>
          {t('privacy')}
        </CleanAnchor>
      </Footer>
    )
  }
}

export default withTranslation(['layout', 'settings'])(GeneralFooter)
