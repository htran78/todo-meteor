import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tasks } from './../api/tasks.js';

export default class Task extends Component{
    toggleChecked() {
        Tasks.update(this.props.task._id,
            { $set: { checked: !this.props.task.checked } }
        );
    }

    deleteThisTask() {
        Tasks.remove(this.props.task._id);
    }
    
    render() {
        const taskClassname = this.props.task.checked ? 'checked' : '';
        console.log(this.props.task);
        
        return (
            <li className={taskClassname}>
                <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                    &times;
                </button>

                <input
                    type="checkbox"
                    readOnly
                    checked={this.props.task.checked}
                    onChange={this.toggleChecked.bind(this)}
                />

                <span className="text">
                    <strong>{this.props.task.username}</strong>: {this.props.task.text}
                </span>
            </li>
        );
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired
};
