import React from "react";
import { getuser } from '../../../libs/User';
import {Grid, Card, CardActionArea, CardMedia, Typography, CardContent, Accordion, AccordionSummary} from '@material-ui/core';
import { getUsersHives } from '../../../libs/Hive';
import Hive from '../../home/Hive';

export interface PublicProfileProps {
    history: History
    userId: string
}
export default class PublicProfile extends React.Component<PublicProfileProps, {
    userId: string
    userData: any
    viewHives: any
}>{
    constructor(props: PublicProfileProps) {
        super(props);

        this.state = {
            userId: props.userId,
            userData: <div></div>,
            viewHives: []
        }
    }

    componentDidMount() {
        this.loadUser();
        this.loadHives();
    }

    async loadUser () {
        const user = await (await getuser(this.state.userId)).data;
        this.setState({
            ...this.state,
            userData: user,
        })
        
    }

    async loadHives() {
        let userHives = (await getUsersHives(this.state.userId)).data.Items;
        let viewHives = userHives.filter(hive => hive.viewable);
        let showHives = viewHives.map(hive => <React.Fragment key={hive.hiveId}>
                                              <Accordion style={{ backgroundColor: "#dcdcdc" }}>
                                              <AccordionSummary>
                                                <Typography variant="h5">{hive.name}</Typography>
                                              </AccordionSummary>
                                              <Hive hiveData={hive}></Hive>
                                              </Accordion>
                                              </React.Fragment>
        );

        this.setState({
            ...this.state,
            'viewHives': showHives
        });
    }

    render () {
        return (
            <div>
                <Grid style={{ marginTop: "5em", maxWidth: "600px", marginBottom:"2em"}} container justify="center" >
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
                <Grid style={{maxWidth: "600px"}}>
                    {this.state.viewHives.length ? this.state.viewHives : <span>No hives found.</span>}
                </Grid>
            </div>
        )
    }
}