import React from 'react'
import classes from './ButtonLoading.module.css'

function Loading() {
    return (
        <div className={classes.skchase}>
          <div className={classes.skdot}></div>
          <div className={classes.skdot}></div>
          <div className={classes.skdot}></div>
          <div className={classes.skdot}></div>
          <div className={classes.skdot}></div>
          <div className={classes.skdot}></div>
        </div>
    )
}

export default Loading
