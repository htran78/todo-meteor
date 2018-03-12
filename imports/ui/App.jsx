import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

//import api
import { Tasks } from './../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false
        };
    }

    toggleHideCompleted() {
        this.setState(
            (prevState) => ({ hideCompleted: !prevState.hideCompleted })
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        const textInput = ReactDOM.findDOMNode(this.refs.textInput);
        const text = textInput.value.trim();
        
        console.log('>> ', Meteor.user());
        

        Tasks.insert({
            text: text,
            createAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        //clear text after press Enter
        textInput.value = '';
    }

    renderFormInputting() {
        if (this.props.currentUser) {
            return (
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                    <input
                        type="text"
                        ref="textInput"
                        placeholder="Please type to add new taks"
                    />
                </form>
            );    
        }
    }

    renderTasks() {
        let filteredTask = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTask = filteredTask.filter(task => !task.checked);
        }

        return filteredTask.map(task => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>My Todo List: {this.props.incompleteCount}</h1>
                </header>

                <label className="hide-completed">
                    <input
                        type="checkbox"
                        readOnly
                        checked={this.state.checked}
                        onChange={this.toggleHideCompleted.bind(this)}
                    />
                    Hide Completed Tasks
                </label>

                <AccountsUIWrapper />

                {this.renderFormInputting()}

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object
};

export default createContainer(() => {
    return {
        tasks: Tasks.find({}, { sort: { createAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user()
    };
}, App);
