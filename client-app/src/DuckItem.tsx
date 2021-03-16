import React from 'react';
import {duck1} from './demo';

export default function DuckItem() {
    return (
        <div>
            <p>{duck1.name}</p>
            <button onClick={() => duck1.makeSound(`${duck1.name} whack`)}>Make sound</button>
        </div>
    )
}