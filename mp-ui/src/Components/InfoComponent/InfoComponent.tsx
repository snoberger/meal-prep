import { withTheme } from '@material-ui/core';
import React from 'react';
import "./InfoComponent.css";
import xIcon  from '../../assets/xIcon.svg';
import { getAuthAlert } from '../../store/auth/reducers/auth';
import { State } from '../../store/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { clearAuthAlert } from '../../store/auth/actions/auth';
import { RouteComponentProps } from 'react-router-dom';
export enum InfoComponentMessageType {
    ERROR = 'error',
    SUCCESS = 'success'
}
export interface InfoMessage {
    header?: string,
    body?: string
}

const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
        alert: getAuthAlert(state)
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        clearAuthAlert: () => dispatch(clearAuthAlert())
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );
  
type PropsFromRedux = ConnectedProps<typeof connector>
type InfoComponentCombinedProps = PropsFromRedux & InfoComponentProps;
interface InfoComponentProps extends RouteComponentProps<any> {
    type?: InfoComponentMessageType,
    message?: InfoMessage,
    theme: any
}
class InfoComponent extends React.Component<InfoComponentCombinedProps, {
    type: InfoComponentMessageType
}> {
    constructor(props: InfoComponentCombinedProps) {
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
                
                <div onClick={() => {
                    this.props.clearAuthAlert();
                }} className="info-component-icon">
                    <img alt="" src={xIcon}></img>
               </div>
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
export default connector(withTheme(InfoComponent));