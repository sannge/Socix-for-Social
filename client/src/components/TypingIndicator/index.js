import React from "react";
import "./TypingIndicator.css";

function TypingIndicator() {
	return (
		<div className='ticontainer'>
			<div className='tiblock'>
				<div className='tidot'></div>
				<div className='tidot'></div>
				<div className='tidot'></div>
			</div>
		</div>
	);
}

export default TypingIndicator;
