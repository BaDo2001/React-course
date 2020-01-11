import React, { useReducer } from "react";
import uuid from "uuid";
import ContactContext from "./ContactContext";
import conatctReducer from "./ContactReducer";
import { ADD_CONTACT, DELETE_CONTACT, SET_CURRENT, CLEAR_CURRENT, UPDATE_CONTACT, FILTER_CONTACTS, CLEAR_FILTER } from "../types";

const ContactState = props => {
	const initialState = {
		contacts: [
			{
				id: 1,
				type: "professional",
				name: "Sara Smith",
				email: "ssmith@gmail.com",
				phone: "111-111-1111"
			},
			{
				id: 2,
				type: "personal",
				name: "Harry White",
				email: "harry@gmail.com",
				phone: "322-222-2222"
			},
			{
				id: 3,
				type: "personal",
				name: "Sam Smith",
				email: "sam@gmail.com",
				phone: "444-444-4444"
			}
		]
	};

	const [state, dispatch] = useReducer(conatctReducer, initialState);

	// Add Contact

	// Delete Contact

	// Set Current Contact

	// Clear Current Contact

	// Update Contact

	// Filter Contacts

	// Clear Filter

	return (
		<ContactContext.Provider
			value={{
				contacts: state.contacts
			}}
		>
			{props.children}
		</ContactContext.Provider>
	);
};

export default ContactState;
