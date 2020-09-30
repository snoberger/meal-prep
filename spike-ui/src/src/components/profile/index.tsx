import React from 'react';
import NavBar from '../NavBar';


export interface ProfileProps {

}

const emptyProfilePicture = require('../../assets/emptyProfilePicture.png')
export default class Profile extends React.Component<ProfileProps, {}>{

    constructor(props: ProfileProps) {
        super(props);

        this.state = {

        }
    }
    componentDidMount() {

    }

    imagePress = () => {

    }
    render() {
        return (
            <div>
                <NavBar />
                <div style={{flex: 1}}>
                    <div onClick={this.imagePress}>
                        <img alt="" style={{
                            height: 'auto',
                            aspectRatio: 'initial',
                            width: '10vw', 
                            borderRadius: 25, 
                            border: '1px solid black',
                            borderColor: 'black', 
                            objectFit: 'cover',
                            borderWidth: 1}} src={emptyProfilePicture}>
                        </img>
                    </div>
                </div>
            </div>
        );
    }
}