// @flow

import * as React from 'react'
import styled from 'styled-components'
import TunewsIcon from './../assets/TunewsActiveLogo.png'
import { CityModel, TunewsModel } from '@integreat-app/integreat-api-client'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import TunewsDetailsFooter from '../components/TunewsDetailsFooter'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityNotFoundError from '../../../modules/app/errors/CityNotFoundError'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledWrapper = styled.div`
  padding-bottom: 50px;
`
const StyledBanner = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  margin: 25px 0;
  background-color: ${({ theme }) => (theme.colors.tunewsThemeColorLight)};
  border-radius: 11px;
`
const StyledBannerImage = styled.img`
  max-height: 100%;
`
const StyledTitle = styled.div`
  display: flex;
  width: 205px;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.colors.tunewsThemeColor)};
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  font-size: 20px;
  font-weight: 700;
`
const Title = styled.h2`
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: 700;
`
const Content = styled.p`
  font-size: 16px;
  line-height: 1.38;
`
type PropsType = {|
  tunewsElement: TunewsModel,
  language: string,
  id: number,
  city: string,
  cities: Array<CityModel>
|}

export class TunewsDetailsPage extends React.PureComponent<PropsType> {
  render () {
    const { tunewsElement, language, id, city, cities } = this.props

    const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
    if (!currentCity) {
      return <FailureSwitcher error={new CityNotFoundError()} />
    } else if (!currentCity.tunewsEnabled) {
      const error = new ContentNotFoundError({ type: 'category', id, city, language })
      return <FailureSwitcher error={error} />
    } else if (!tunewsElement) {
      const error = new ContentNotFoundError({ type: 'tunewsItem', id, city, language })
      return <FailureSwitcher error={error} />
    }

    const { title, content, date, eNewsNo } = tunewsElement
    return (
      <StyledContainer>
        <StyledWrapper>
          <StyledBanner>
            <StyledTitle>
              <StyledBannerImage src={TunewsIcon} alt='' />
            </StyledTitle>
          </StyledBanner>
          <Title>{title}</Title>
          <Content>{content}</Content>
        </StyledWrapper>
        <TunewsDetailsFooter eNewsNo={eNewsNo} date={date} language={language} />
      </StyledContainer>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  id: state.location.payload.id,
  city: state.location.payload.city,
  cities: state.cities.data
})

export default connect<PropsType, *, *, *, *, *>(mapStateToProps)(TunewsDetailsPage)
