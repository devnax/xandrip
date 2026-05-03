import React from 'react';
import ViewBox from '@xanui/ui/ViewBox'
import Widget from './Widget'
import Droppable from '../src/Droppable'
import Draggable from '../src/Draggable'
import Box from '@xanui/ui/Box'
import XandripRoot from '../src/XandripRoot'
import Text from '@xanui/ui/Text';

const Example = () => {
   return (
      <XandripRoot
         onDrop={({ source, data }) => {
            console.log(source);
         }}
         canCopy={(state) => {
            return state.source.id === "widget"
         }}
         // canDrop={(state) => {
         //    if (state.target?.id === "new") {
         //       return true
         //    }
         //    return false
         // }}
         // canDrag={(state, e) => {
         //    const target = e.target as HTMLElement
         //    if (target.tagName === "BUTTON") {
         //       return true
         //    }
         //    return false
         // }}
         style={{
            width: "100%",
         }}

      // renderActiveItem={(state) => {
      //    if (!state.target) {
      //       return <Box>No</Box>
      //    }

      //    return <Box
      //       width={60}
      //       height={60}
      //       bgcolor="black"
      //       shadow={2}
      //    >Hello</Box>
      // }}

      // renderPlaceholder={() => {
      //    return <Box>Hello</Box>
      // }}

      // getActiveDroppableProps={(state) => {
      //    if (!state.target) {
      //       return {
      //          style: {
      //             background: "transparent",
      //             border: "none"
      //          }
      //       }
      //    }

      //    return {
      //       style: {
      //          background: "red",
      //          border: "2px dashed grey"
      //       }
      //    }
      // }}

      // getPlaceholderProps={() => {
      //    return {
      //       style: {
      //          background: "red",
      //          border: "2px dashed grey"
      //       }
      //    }
      // }}

      // getActiveItemProps={(state) => {
      //    if (!state.target?.id) {
      //       return {
      //          style: {
      //             background: "pink",
      //             border: "2px dashed grey"
      //          }
      //       }
      //    }
      //    return {
      //       style: {
      //          background: "red",
      //          border: "2px dashed grey"
      //       }
      //    }
      // }}
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
      </XandripRoot>
   )
}

export default Example
