import React from "react";
import { getuser } from '../../../libs/User';
import {Grid, Card, CardActionArea, CardMedia, Typography, CardContent} from '@material-ui/core';

export interface PublicProfileProps {
    history: History
    userId: string
}
export default class PublicProfile extends React.Component<PublicProfileProps, {
    userId: string
    userData: any
}>{
    constructor(props: PublicProfileProps) {
        super(props);

        this.state = {
            userId: props.userId,
            userData: <div></div>,
        }
    }
    
    componentDidMount() {
        this.loadUser();
    }

    async loadUser () {
        const user = await (await getuser(this.state.userId)).data;
        console.log(user);
        this.setState({
            ...this.state,
            userData: user,
        })
        
    }

    render () {
        return (
            <div>
                <Grid style={{ marginTop: "5em"}} container justify="center" >
                    <Card>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                src={this.state.userData.image === 'none' ? require("../../../assets/emptyProfilePicture.png") : this.state.userData.image}
                                title="Profile Picture"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {this.state.userData.user}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {this.state.userData.address}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </div>
        )
    }
}