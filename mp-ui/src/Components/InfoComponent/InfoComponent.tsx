import { withTheme } from '@material-ui/core';
import React from 'react';
import "./InfoComponent.css";
export enum InfoComponentMessageType {
    ERROR = 'error',
    SUCCESS = 'success'
}
export interface InfoMessage {
    header?: string,
    body?: string
}
interface InfoComponentProps {
    type?: InfoComponentMessageType,
    message?: InfoMessage,
    theme: any
}
class InfoComponent extends React.Component<InfoComponentProps, {
    type: InfoComponentMessageType
}> {
    constructor(props: InfoComponentProps) {
        super(props);

        this.state = {
            type: this.props.type || InfoComponentMessageType.SUCCESS
        };
    }
    determineBackgroundColor = () => {
        switch (this.state.type) {
            case InfoComponentMessageType.ERROR:
                return this.props.theme.palette.error.main;
            case InfoComponentMessageType.SUCCESS:
                return this.props.theme.palette.success.main;
            default:
                return '#ffffff';
        }
    }
    render() {
        if(!this.props.message) {
            return null;
        }
        return(
            <div className="info-component-container">
                <style>
                    {`:root {
                        --info-color: ${this.determineBackgroundColor()};
                    }
                    `}
                </style>
                <div className="info-component-header">
                    {this.props.message.header}
                </div>
                
                <div className="info-component-body">
                    {this.props.message.body}
                </div>

            </div>
        );
    }
}

export default withTheme(InfoComponent);