import React from 'react';
import ViewBox from '@xanui/ui/ViewBox'
import Widget from './Widget'
import Droppable from '../src/Droppable'
import Draggable from '../src/Draggable'
import Box from '@xanui/ui/Box'
import Wrapper from '../src/Wrapper'

const Example = () => {
   return (
      <Wrapper>
         <ViewBox
            height="100%"
            horizental
            startContent={<Widget />}
         >
            <Droppable id="main">
               <Draggable id="a">
                  <Box>Hee</Box>
               </Draggable>
               <Draggable id="b">
                  <Box>well</Box>
               </Draggable>
            </Droppable>
         </ViewBox>
      </Wrapper>
   )
}

export default Example
