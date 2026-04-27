import React from 'react';
import Box from '@xanui/ui/Box';
import Stack from '@xanui/ui/Stack'
import Text from '@xanui/ui/Text';
import { ReactElement } from 'react'
import TextFields from '@xanui/icons/TextFields'
import Droppable from '../src/Droppable';
import Draggable from '../src/Draggable';

type IconProps = {
   name: string;
   icon: ReactElement
}
const Icon = ({ name, icon }: IconProps) => {
   return (
      <Stack
         p={3}
         radius={2}
         alignItems={"center"}
         justifyContent={"center"}
         border={"1px solid"}
         borderColor='surface.divider'
         bgcolor={"surface.main"}
         width={130}
         height={100}
         userSelect={"none"}
      >
         <Box>{icon}</Box>
         <Text>{name}</Text>
      </Stack>
   )
}

const Widget = () => {
   return (
      <Stack
         width={450}
         bgcolor="surface.light"
         height="100vh"
         p={2}
         gap={2}
      >
         <Text variant={"h6"}>Widgets</Text>
         <Stack
            flexRow
         >
            <Droppable id="widget" style={{
               display: "flex",
               flexDirection: "row",
               flexWrap: "wrap",
               gap: 8
            }}>
               <Draggable id="wa">
                  <Icon name="Text" icon={<TextFields />} />
               </Draggable>
               <Draggable id="wb">
                  <Icon name="View" icon={<TextFields />} />
               </Draggable>
               <Draggable id="wc">
                  <Icon name="View" icon={<TextFields />} />
               </Draggable>
               <Draggable id="wd">
                  <Icon name="View" icon={<TextFields />} />
               </Draggable>
               <Draggable id="we">
                  <Icon name="View" icon={<TextFields />} />
               </Draggable>
               <Draggable id="wg">
                  <Icon name="View" icon={<TextFields />} />
               </Draggable>
            </Droppable>
         </Stack>
      </Stack>
   )
}

export default Widget
