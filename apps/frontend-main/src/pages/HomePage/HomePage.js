import React, { Component } from 'react';

import BackImage__HappyPeopleSvg from '../../assets/svg/backImage__happyPeople.svg';
import DevGagLogoSvg from '../../assets/svg/devgag_logo.svg';

import './HomePage.css';

export default class HomePage extends Component {
    render() {
        return (
            <div className='HomePage'>
                <div className='HomePage__header'>
                    <img src={DevGagLogoSvg} alt='DevGag Logo' />
                    <h1>Welcome To DevGag</h1>
                </div>

                <div className='HomePage__body'>
                    <img
                        src={BackImage__HappyPeopleSvg}
                        alt='DevGag Welcome People'
                    />
                </div>
            </div>
        );
    }
}
