import React from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// import "./RightClick.scss";

const ContextMenuComponent = () => {
	function handleClick(e, data) {
		
	  }
	return (
		<div  style={{border:"2px solid red"}}>
			<div>
				{/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
				{/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

				<div style={{width:"100%",border:"2px solid red"}}>
				<ContextMenuTrigger id="same_unique_identifier">
					<div className="well">Right click to see the menu</div>
				</ContextMenuTrigger>
				</div>

				<ContextMenu id="same_unique_identifier">
					<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
						ContextMenu Item 1
					</MenuItem>
					<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
						ContextMenu Item 2
					</MenuItem>
					<MenuItem divider />
					<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
						ContextMenu Item 3
					</MenuItem>
				</ContextMenu>

			</div>
		</div>
	)
}

export default ContextMenuComponent