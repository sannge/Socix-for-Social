import React from 'react'
import classes from './FormButton.module.css'
function FormButton(props) {
    return (
        <button className={classes.__btn} {...props}/>
    )
}

export default FormButton
