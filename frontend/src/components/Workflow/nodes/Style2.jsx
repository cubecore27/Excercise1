import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdminNav from '../../navigation/Navigationbar';

// Inject CSS for flow animation
const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes dashFlow {
  to {
    stroke-dashoffset: -12;
  }
}
`;
document.head.appendChild(styleTag);

const HANDLE_STYLE = {
  width: 10,
  height: 10,
  background: '#555',
  borderRadius: '50%',
  position: 'absolute',
};

const EditableNode = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        minWidth: 180,
        position: 'relative',
      }}
    >
      <input
        type="text"
        value={data.label}
        onChange={(e) => data.onChange({ ...data, label: e.target.value })}
        placeholder="Step Name"
        style={{ width: '100%', marginBottom: 6 }}
      />
      <textarea
        value={data.description}
        onChange={(e) => data.onChange({ ...data, description: e.target.value })}
        placeholder="Description"
        rows={2}
        style={{ width: '100%', marginBottom: 6 }}
      />
      <textarea
        value={data.instruction}
        onChange={(e) => data.onChange({ ...data, instruction: e.target.value })}
        placeholder="Instruction"
        rows={2}
        style={{ width: '100%' }}
      />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...HANDLE_STYLE, left: '50%', bottom: -5, transform: 'translateX(-50%)' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ ...HANDLE_STYLE, right: -5, top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="target" position={Position.Top} id="top" style={{ ...HANDLE_STYLE, left: '50%', top: -5, transform: 'translateX(-50%)' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ ...HANDLE_STYLE, left: -5, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
};

const SmartEdge = ({ id, sourceX, sourceY, targetX, targetY, data, markerEnd, style }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isLoop = sourceX === targetX && sourceY === targetY;
  const isBackward = sourceY > targetY;
  const labelX = (sourceX + targetX) / 2 + (isLoop ? 40 : isBackward ? 20 : 0);
  const labelY = (sourceY + targetY) / 2 - (isLoop ? 40 : isBackward ? 20 : 0);

  return (
    <>
      <path
        id={id}
        d={edgePath}
        stroke={style?.stroke || '#888'}
        strokeWidth={style?.strokeWidth || 2}
        fill="none"
        markerEnd={markerEnd}
        style={{
          strokeDasharray: style?.animated ? '6' : 'none',
          animation: style?.animated ? 'dashFlow 1s linear infinite' : 'none',
        }}
      />
      <foreignObject x={labelX - 50} y={labelY - 20} width={100} height={40}>
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 4, textAlign: 'center', fontSize: 12 }}>
          {data?.label || 'Transition'}
        </div>
      </foreignObject>
    </>
  );
};

const nodeTypes = { editable: EditableNode };
const edgeTypes = { smart: SmartEdge };

function findPathEdgesExplicit(nodes, edges, startId, endId) {
  const graph = new Map();
  nodes.forEach((node) => graph.set(node.id, []));
  edges.forEach((edge) => {
    graph.get(edge.source).push({ target: edge.target, id: edge.id });
  });

  const pathEdgeIds = new Set();

  const dfs = (currentId, visited = new Set()) => {
    if (visited.has(currentId)) return;

    visited.add(currentId);

    if (!graph.has(currentId)) return;

    for (const { target, id } of graph.get(currentId)) {
      if (visited.has(target)) continue;

      if (target === endId) {
        pathEdgeIds.add(id);
        continue;
      }

      pathEdgeIds.add(id);
      dfs(target, new Set(visited));
    }
  };

  dfs(startId);
  return pathEdgeIds;
}


export default function Style2() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [startNodeId, setStartNodeId] = useState(null);
  const [endNodeId, setEndNodeId] = useState(null);

  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...newData, onChange: (data) => updateNodeData(id, data) } } : node
      )
    );
  };

  const addNode = () => {
    const newId = nodeCounter.toString();
    const newNode = {
      id: newId,
      type: 'editable',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `Step ${newId}`,
        description: '',
        instruction: '',
        onChange: (data) => updateNodeData(newId, data),
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCounter((n) => n + 1);
  };

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      const isHorizontal = Math.abs(sourceNode.position.x - targetNode.position.x) > Math.abs(sourceNode.position.y - targetNode.position.y);

      let sourceHandle = 'bottom';
      let targetHandle = 'top';

      if (sourceNode.id === targetNode.id) {
        sourceHandle = 'right';
        targetHandle = 'left';
      } else if (isHorizontal) {
        sourceHandle = sourceNode.position.x < targetNode.position.x ? 'right' : 'left';
        targetHandle = sourceNode.position.x < targetNode.position.x ? 'left' : 'right';
      } else {
        sourceHandle = sourceNode.position.y < targetNode.position.y ? 'bottom' : 'top';
        targetHandle = sourceNode.position.y < targetNode.position.y ? 'top' : 'bottom';
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            sourceHandle,
            targetHandle,
            type: 'smart',
            data: { label: 'Transition' },
            markerEnd: { type: 'arrowclosed' },
            style: { stroke: '#999' },
          },
          eds
        )
      );
    },
    [setEdges, nodes]
  );

  const onEdgeDoubleClick = (event, edge) => {
    const label = prompt('Edit transition name:', edge.data?.label || '');
    if (label !== null) {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edge.id ? { ...e, data: { ...e.data, label } } : e
        )
      );
    }
  };

  useEffect(() => {
    if (nodes.length === 0) addNode();
  }, []);

  useEffect(() => {
    if (!startNodeId || !endNodeId) return;
  
    const edgeIds = findPathEdgesExplicit(nodes, edges, startNodeId, endNodeId);
  
    // Avoid unnecessary updates: only change if styles are truly different
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const isPath = edgeIds.has(edge.id);
        const isAlreadyStyled = edge.style?.animated === isPath;
  
        if (isAlreadyStyled) return edge; // no change needed
  
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isPath ? 'green' : '#ccc',
            strokeWidth: isPath ? 2 : 1,
            animated: isPath,
          },
        };
      })
    );
  }, [startNodeId, endNodeId, nodes]); // ✅ ✅ removed `edges` from here
  

  return (
    <>
      <AdminNav />
      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <div style={{ flex: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', gap: 10 }}>
            <button
              onClick={addNode}
              style={{ padding: '6px 12px', background: '#e5e7eb', border: '1px solid #ccc', borderRadius: 4 }}
            >
              + Add Node
            </button>

            <select value={startNodeId || ''} onChange={(e) => setStartNodeId(e.target.value)} style={{ padding: 6 }}>
              <option value="">Start Node</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>{node.data.label || node.id}</option>
              ))}
            </select>

            <select value={endNodeId || ''} onChange={(e) => setEndNodeId(e.target.value)} style={{ padding: 6 }}>
              <option value="">End Node</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>{node.data.label || node.id}</option>
              ))}
            </select>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeDoubleClick={onEdgeDoubleClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        <div style={{ flex: 1, padding: 16, backgroundColor: '#f8f9fa', borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
          <h3>Workflow JSON</h3>
          <pre style={{ fontSize: 12, lineHeight: 1.4, background: '#fff', border: '1px solid #ddd', padding: 12, borderRadius: 4, maxHeight: '90%' }}>
            {JSON.stringify({ nodes, edges }, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
