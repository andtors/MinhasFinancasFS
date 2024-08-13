import React from 'react'

const FormGroup = (props) => {
    return (
        <div>
            <div className="form-group mb-4">
                <label className='mb-2' htmlFor={props.htmlFor}>{props.label}: *</label>
                {props.children}
            </div>
        </div>
    )
}

export default FormGroup