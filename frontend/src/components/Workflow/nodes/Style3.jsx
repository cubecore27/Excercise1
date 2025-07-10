import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdminNav from '../../navigation/Navigationbar';

const ProfessionalNode = ({ data, selected }) => {
  const getNodeConfig = () => {
    switch (data.type) {
      case 'start':
        return {
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          icon: '▶',
          borderColor: '#10b981'
        };
      case 'end':
        return {
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          icon: '⏹',
          borderColor: '#ef4444'
        };
      case 'decision':
        return {
          background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
          icon: '◆',
          borderColor: '#f59e0b'
        };
      case 'process':
        return {
          background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
          icon: '⚙',
          borderColor: '#3b82f6'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
          icon: '●',
          borderColor: '#9ca3af'
        };
    }
  };

  const config = getNodeConfig();

  return (
    <div style={{
      background: config.background,
      border: selected ? `3px solid #fbbf24` : `2px solid ${config.borderColor}`,
      borderRadius: '10px',
      padding: '16px',
      minWidth: '140px',
      color: 'white',
      boxShadow: selected
        ? '0 10px 30px rgba(251, 191, 36, 0.3), 0 0 0 4px rgba(251, 191, 36, 0.1)'
        : '0 8px 25px rgba(0,0,0,0.4)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: selected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#fbbf24' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#fbbf24' }} />

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: selected
          ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
        borderRadius: '8px',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>{config.icon}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            opacity: 0.9
          }}>
            {data.type || 'Step'}
          </span>
        </div>

        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: data.description ? '6px' : '0'
        }}>
          {data.label}
        </div>

        {data.description && (
          <div style={{
            fontSize: '12px',
            opacity: 0.85,
            lineHeight: '1.3'
          }}>
            {data.description}
          </div>
        )}

        {data.duration && (
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            padding: '3px 8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            ⏱ {data.duration}
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  professional: ProfessionalNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'professional',
    position: { x: 100, y: 100 },
    data: {
      label: 'Initialize System',
      type: 'start',
      description: 'Bootstrap application components',
      duration: '2min'
    }
  },
  {
    id: '2',
    type: 'professional',
    position: { x: 350, y: 100 },
    data: {
      label: 'Data Processing',
      type: 'process',
      description: 'Transform and validate input data',
      duration: '5min'
    }
  },
  {
    id: '3',
    type: 'professional',
    position: { x: 600, y: 100 },
    data: {
      label: 'Quality Check',
      type: 'decision',
      description: 'Verify processing results',
      duration: '1min'
    }
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: {
      stroke: '#64748b',
      strokeWidth: 3,
      strokeDasharray: '5,5'
    },
    markerEnd: { type: 'arrowclosed', color: '#64748b' }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    style: {
      stroke: '#64748b',
      strokeWidth: 3,
      strokeDasharray: '5,5'
    },
    markerEnd: { type: 'arrowclosed', color: '#64748b' }
  },
];

export default function Style3() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCounter, setNodeCounter] = useState(4);
  const [selectedNodeType, setSelectedNodeType] = useState('process');
  const [showSidebar, setShowSidebar] = useState(true);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            label: '→',
            style: {
              stroke: '#64748b',
              strokeWidth: 3,
              strokeDasharray: '5,5'
            },
            markerEnd: { type: 'arrowclosed', color: '#64748b' }
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = () => {
    const durations = ['1min', '2min', '5min', '10min', '30min'];
    const newNode = {
      id: nodeCounter.toString(),
      type: 'professional',
      position: {
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      },
      data: {
        label: `${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} ${nodeCounter}`,
        type: selectedNodeType,
        description: `Automated ${selectedNodeType} step with advanced configuration`,
        duration: durations[Math.floor(Math.random() * durations.length)]
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCounter(nodeCounter + 1);
  };

  return (
    <>
      <AdminNav />
      <div style={{
        width: '100vw',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        background: '#0f172a',
        color: 'white'
      }}>
        {/* Sidebar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: showSidebar ? 0 : '-300px',
          width: '280px',
          height: '100%',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRight: '1px solid #334155',
          padding: '24px',
          zIndex: 10,
          transition: 'left 0.3s ease',
          boxShadow: '4px 0 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚡ Workflow Studio
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#cbd5e1'
            }}>
              Node Type
            </label>
            <select
              value={selectedNodeType}
              onChange={(e) => setSelectedNodeType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #475569',
                background: '#334155',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="start">🚀 Start Node</option>
              <option value="process">⚙️ Process Node</option>
              <option value="decision">💎 Decision Node</option>
              <option value="end">🏁 End Node</option>
            </select>
          </div>

          <button
            onClick={addNode}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '24px',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            + Add New Node
          </button>

          <div style={{
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
              Workflow Stats
            </div>
            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
              📊 Total Nodes: {nodes.length}
            </div>
            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
              🔗 Connections: {edges.length}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            position: 'absolute',
            top: '20px',
            left: showSidebar ? '300px' : '20px',
            zIndex: 11,
            padding: '8px',
            background: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '6px',
            color: '#cbd5e1',
            cursor: 'pointer',
            transition: 'left 0.3s ease'
          }}
        >
          {showSidebar ? '←' : '→'}
        </button>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
            marginLeft: showSidebar ? '280px' : '0',
            transition: 'margin-left 0.3s ease'
          }}
        >
          <Controls
            style={{
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px'
            }}
            showInteractive={false}
          />
          <Background
            variant="dots"
            gap={20}
            size={1.5}
            color="rgba(100, 116, 139, 0.4)"
          />
        </ReactFlow>
      </div>
    </>
  );
}
