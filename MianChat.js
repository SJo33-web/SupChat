import React, { useState, useEffect } from 'react'
import { Avatar, IconButton } from "@material-ui/core"
import "./MainChat.css"
import { DonutLarge } from '@material-ui/icons'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { useParams } from "react-router-dom";
import db from "./firebase"
import firebase from 'firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateValue } from "./StateProvider"
import * as timeago from 'timeago.js';
import { auth } from "./firebase"
import InputEmoji from "react-input-emoji";




// these utilitiees from materila ui dialogue
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

// function that manages dialogue styling
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

//functions to open and close a dialogue

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };



}



export default function MainChat() {
    const { roomId } = useParams()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [{ user }, dispatch] = useStateValue()
    const [channelname, setchannelName] = useState('')
    const classes = useStyles();
    //declaring dialogue variables
    const [open, setOpen] = React.useState(false);
    //   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        // setSelectedValue(value);
    };



    //fuction to send messages
    const sendMessage = (e) => {
        e.preventDefault();
        db.collection("Rooms").doc(roomId).collection('messages').add({
            text: message,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()

        }).catch((e) => toast.error(e.message))
        toast.success('Sent')
        setMessage('')
    }

    //function to retrive messages from thr db
    useEffect(() => {
        if (roomId) {
            db.collection('Rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snap => {
                setMessages(snap.docs.map(doc => doc.data()))
            })
            db.collection("Rooms").doc(roomId).onSnapshot(res => {
                setchannelName(res.data().chatname)
            })
        }
    }, [roomId])


    //methos to clear messsages
    const deleteMessages = () => {
        if (roomId) {
            db.collection('Rooms').doc(roomId).collection('messages').get().then(function (querySnapshop) {
                querySnapshop.forEach(function (doc) {
                    doc.ref.delete()
                    toast.success('messages cleared')
                });
            })
        }
        setOpen(false)
    }

    // function to logout
    const logout = () => {
        auth.signOut()
        dispatch({
            type: 'SET_USER',
            user: null
        })
        setOpen(false)
    }

    return (
        <div className="chat-field">
            <ToastContainer />
            <div className="message-header">
                <Avatar />
                <div className="header-info">
                    <h3>{channelname}</h3>
                    {messages.length > 0 ? (
                        <p>{new Date(messages[messages.length - 1]?.timestamp?.toDate()).toLocaleString()}</p>
                    ) : (
                        <p>No messages in this channel</p>
                    )

                    }

                </div>
                <div className="message-right">
                    <IconButton>
                        <AccountBoxIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={handleClickOpen}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            {/* create a div here and give is a class name message body */}
            <div className="message-body">
                {messages.map((msg) => (
                    <p className={`chat-message ${msg.name === user.displayName && 'sender'}`}>{msg.text}<br />
                        <small className="time">{timeago.format(new Date(msg?.timestamp?.toDate()))}</small>
                    </p>
                ))

                }


            </div>
            <div className="message-footer">
                <form>
                    <InputEmoji value={message} onChange={setMessage} cleanOnEnter placeholder="Type a message" />
                    {/* <input  value={message} onChange={(e)=>setMessage(e.target.value)}   /> */}
                    <button onClick={sendMessage}>Send Message</button>
                </form>
            </div>


            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Your Account Settings</DialogTitle>
                <List className="list-Item">
                    <ListItem onClick={logout} className="list-Item" >
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText className="list-Item" primary="Logout" />
                    </ListItem>
                    <ListItem className="list-Item">
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText onClick={deleteMessages} className="list-Item" primary="Clear Messages" />
                    </ListItem>
                </List>
            </Dialog>


        </div>
    )
}