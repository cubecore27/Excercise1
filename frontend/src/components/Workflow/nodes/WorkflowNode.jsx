import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeResizer,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';



const initialNodes = [
  { id: '1', type: 'textUpdater', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function TextUpdaterNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="text-updater-node">
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
    </div>
  );
}

const nodeTypes = {
  textUpdater: TextUpdaterNode
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const initialNodes2 = [
    { id: '3', position: { x: 0, y: 0 }, data: { label: '3' } },
    { id: '4', position: { x: 0, y: 100 }, data: { label: '4' } },
  ];

  // ✅ Proper way to replace nodes after initial render
//   useEffect(() => {
//     setNodes(initialNodes2);
//   }, [setNodes]);

  const addnode = () => {
    setNodes(
        (prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: { label: `Node ${prev.length + 1}` },
      },
    ]
);
  };

  useEffect(() => {
    console.log('Nodes updated:', nodes);
  }, [nodes]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={addnode}>Add Node</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={3} />
        <NodeResizer minWidth={100} minHeight={30} />
      </ReactFlow>
    </div>
  );
}
