import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Page from 'modules/common/components/Page'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import DISCLAIMER_ENDPOINT from 'modules/endpoint/endpoints/disclaimer'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'

import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    location: PropTypes.string.isRequired,
    disclaimer: PropTypes.instanceOf(DisclaimerModel).isRequired,
    setLanguageChangeUrls: PropTypes.func.isRequired
  }

  mapLanguageToUrl = (language) => `/${this.props.location}/${language}/disclaimer`

  componentDidMount () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages)
  }

  render () {
    return <Page title={this.props.disclaimer.title}
                 content={this.props.disclaimer.content} />
  }
}

const mapStateToProps = (state) => ({
  location: state.router.params.location
})

const mapDispatchToProps = (dispatch) => ({
  setLanguageChangeUrls: (urls, languages) => dispatch(
    setLanguageChangeUrls(urls, languages)
  )
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher(DISCLAIMER_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT)
)(DisclaimerPage)