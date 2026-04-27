import React from 'react';
import ViewBox from '@xanui/ui/ViewBox'
import Widget from './Widget'
import Droppable from '../src/Droppable'
import Draggable from '../src/Draggable'
import Box from '@xanui/ui/Box'
import Wrapper from '../src/Wrapper'
import Text from '@xanui/ui/Text';

const Example = () => {
   return (
      <Wrapper
         canCopy={(state) => {
            return state.source.id === "widget"
         }}
         style={{
            width: "100%",
         }}
      >
         <ViewBox
            height="100%"
            horizental
            startContent={<Widget />}
         >
            <Droppable id="main" style={{ width: "100%" }}>
               <Draggable id="a">
                  <Box bgcolor={"red"}>
                     <Text>New Droppable</Text>
                     <Droppable
                        id="new"
                     >
                        <Draggable id="new1">
                           <Box>New 1</Box>
                        </Draggable>
                        <Draggable id="new2">
                           <Box>New 2</Box>
                        </Draggable>
                     </Droppable>
                  </Box>
               </Draggable>
               <Draggable id="b">
                  <Box height={60} bgcolor={"green"}>well</Box>
               </Draggable>
               <Draggable id="yellow">
                  <Box height={60} bgcolor={"yellow"}>Yellow</Box>
               </Draggable>
               <Draggable id="blue">
                  <Box height={60} bgcolor={"blue"}>blue</Box>
               </Draggable>
               <Draggable id="orange">
                  <Box height={60} bgcolor={"orange"}>orange</Box>
               </Draggable>
            </Droppable>
         </ViewBox>
      </Wrapper>
   )
}

export default Example
