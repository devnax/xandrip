import React from 'react';
import ViewBox from '@xanui/ui/ViewBox'
import Widget from './Widget'
import Droppable from '../src/Droppable'
import Draggable from '../src/Draggable'
import Box from '@xanui/ui/Box'
import Text from '@xanui/ui/Text';
import { XandripProvider } from '../src/XandripProvider';

const Example = () => {


   return (
      <XandripProvider
         onDrop={({ source, target, data }) => {
            console.log(source, target);
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
            <XandripProvider
               onDrop={(d) => {
                  console.log(d);

               }}
            >
               <Droppable id="root" style={{ width: "100%", overflow: "auto", height: "100%", background: "red" }}>
                  {
                     Array(1000).fill(1).map((v, i) => {
                        return (
                           <Draggable
                              key={"droppable" + i}
                              id={"draggable-container-" + i}
                           >
                              <Droppable
                                 id={"droppable" + i}
                                 style={{
                                    width: "100%",
                                    border: "1px solid #d0d0d0",
                                    marginBottom: 50,
                                    minHeight: 80,
                                 }}
                              >
                                 {
                                    Array(20).fill(1).map((v, di) => {
                                       return (
                                          <Draggable
                                             key={`draggable-item-${i}-${di}`}
                                             id={`draggable-item-${i}-${di}`}
                                             style={{ width: "100%" }}
                                          >
                                             <Box>
                                                New {di} {i}
                                             </Box>
                                          </Draggable>
                                       )
                                    })
                                 }
                              </Droppable>
                           </Draggable>
                        )
                     })
                  }
               </Droppable>
            </XandripProvider>
         </ViewBox >
      </XandripProvider >
   )
}

export default Example
