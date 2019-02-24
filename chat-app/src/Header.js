import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComments} from '@fortawesome/free-solid-svg-icons';

library.add(faComments);

export default () =>
    <FontAwesomeIcon icon="comments"
                     className={"fa-4x"}
                     style={{margin: "32px 0px"}}/>;
