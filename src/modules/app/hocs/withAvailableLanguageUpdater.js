import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { isEmpty } from 'lodash/lang'

import { setLanguageChangeUrls } from 'modules/app/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LANGUAGE_ENDPOINT from 'modules/endpoint/endpoints/language'

const mapStateToProps = (state) => ({
  location: state.router.params.location,
  route: state.router.route,
  availableLanguages: state.availableLanguages
})

/**
 * A HOC to dispatch {@link setLanguageChangeUrls} actions automatically
 *
 * @param {function(string, string, string)} mapLanguageToUrl A function which maps location, language
 * and a optional id to a url
 * @returns {function(*)} The a function which takes a component and returns a wrapped component
 */
function withAvailableLanguageUpdater (mapLanguageToUrl) {
  return WrappedComponent => {
    class AvailableLanguageUpdater extends React.Component {
      static propTypes = {
        /**
         * from withFetcher HOC which provides data from LANGUAGE_ENDPOINT
         */
        languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
        location: PropTypes.string,
        availableLanguages: PropTypes.object
      }

      createUrls (availableLanguages) {
        let url
        if (!isEmpty(availableLanguages)) {
          // languageChange of a specific page/event with ids in availableLanguages
          url = (language) => mapLanguageToUrl(
            this.props.location,
            language.code,
            availableLanguages[language.code]
          )
        } else {
          url = (language) => mapLanguageToUrl(this.props.location, language.code, '')
        }

        return this.props.languages.reduce((accumulator, language) => ({
          ...accumulator,
          [language.code]: url(language)
        }), {})
      }

      componentDidMount () {
        this.props.dispatch(setLanguageChangeUrls(this.createUrls(this.props.availableLanguages)))
      }

      componentWillUpdate (nextProps) {
        if (nextProps.availableLanguages !== this.props.availableLanguages) {
          this.props.dispatch(setLanguageChangeUrls(this.createUrls(nextProps.availableLanguages)))
        }
      }

      componentWillUnmount () {
        this.props.dispatch(setLanguageChangeUrls({}))
      }

      render () {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return <WrappedComponent {...this.props} />
      }
    }

    return compose(
      withFetcher(LANGUAGE_ENDPOINT),
      connect(mapStateToProps)
    )(AvailableLanguageUpdater)
  }
}

export default withAvailableLanguageUpdater
