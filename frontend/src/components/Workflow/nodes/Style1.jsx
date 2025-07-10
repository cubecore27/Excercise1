import React, { useState, useCallback } from 'react';
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

const WorkflowNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(data);

  const handleSave = () => {
    data.onUpdate(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  const nodeStyle = {
    background: '#fff',
    border: selected ? '2px solid #4f46e5' : '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    minWidth: '200px',
    boxShadow: selected ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
  };

  const editNodeStyle = {
    ...nodeStyle,
    border: '2px solid #3b82f6',
    minWidth: '280px',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const editButtonStyle = {
    ...buttonStyle,
    color: '#6b7280',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    color: '#ef4444',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const saveButtonStyle = {
    padding: '8px 16px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginRight: '8px',
  };

  const cancelButtonStyle = {
    padding: '8px 16px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  };

  if (isEditing) {
    return (
      <div style={editNodeStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Edit Step</h3>
          <div>
            <button onClick={handleSave} style={saveButtonStyle}>Save</button>
            <button onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
          </div>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Step Name
          </label>
          <input
            type="text"
            value={tempData.label}
            onChange={(e) => setTempData({ ...tempData, label: e.target.value })}
            style={inputStyle}
            placeholder="Enter step name"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Description
          </label>
          <textarea
            value={tempData.description}
            onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
            style={textareaStyle}
            rows={3}
            placeholder="Describe what happens in this step"
          />
        </div>
        
        <Handle type="target" position={Position.Top} style={{ width: '12px', height: '12px' }} />
        <Handle type="source" position={Position.Bottom} style={{ width: '12px', height: '12px' }} />
      </div>
    );
  }

  return (
    <div style={nodeStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{data.label}</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={editButtonStyle}
            onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            Edit
          </button>
          <button
            onClick={() => data.onDelete()}
            style={deleteButtonStyle}
            onMouseOver={(e) => e.target.style.background = '#fef2f2'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            Delete
          </button>
        </div>
      </div>
      
      {data.description && (
        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
          {data.description}
        </p>
      )}
      
      <Handle type="target" position={Position.Top} style={{ width: '12px', height: '12px' }} />
      <Handle type="source" position={Position.Bottom} style={{ width: '12px', height: '12px' }} />
    </div>
  );
};

const nodeTypes = {
  workflow: WorkflowNode,
};

export default function SimpleWorkflowManager() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { 
              ...node, 
              data: { 
                ...newData, 
                onUpdate: (data) => updateNodeData(id, data),
                onDelete: () => deleteNode(id)
              } 
            }
          : node
      )
    );
  };

  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const addNode = () => {
    const newId = nodeCounter.toString();
    const newNode = {
      id: newId,
      type: 'workflow',
      position: { x: 100 + (nodeCounter * 50), y: 100 + (nodeCounter * 50) },
      data: {
        label: `Step ${newId}`,
        description: '',
        onUpdate: (data) => updateNodeData(newId, data),
        onDelete: () => deleteNode(newId),
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCounter((n) => n + 1);
  };

  const onConnect = useCallback(
    (params) => {
      const edgeId = `${params.source}-${params.target}`;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: edgeId,
            label: 'Next',
            type: 'smoothstep',
            markerEnd: { type: 'arrowclosed' },
            style: { stroke: '#6366f1', strokeWidth: 2 },
            labelStyle: { fontSize: 12, fontWeight: 600 },
            labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onEdgeClick = (event, edge) => {
    setSelectedEdge(edge);
  };

  const onEdgeDoubleClick = (event, edge) => {
    const newLabel = prompt('Enter transition name:', edge.label);
    if (newLabel !== null && newLabel.trim() !== '') {
      setEdges((eds) =>
        eds.map((e) => (e.id === edge.id ? { ...e, label: newLabel.trim() } : e))
      );
    }
  };

  const updateEdgeLabel = (newLabel) => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((e) => (e.id === selectedEdge.id ? { ...e, label: newLabel } : e))
      );
    }
  };

  const deleteEdge = () => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  };

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setNodeCounter(1);
  };

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const mainAreaStyle = {
    flex: 1,
    position: 'relative',
  };

  const toolbarStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    zIndex: 10,
    display: 'flex',
    gap: '8px',
  };

  const primaryButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s',
  };

  const dangerButtonStyle = {
    ...primaryButtonStyle,
    backgroundColor: '#ef4444',
  };

  const emptyStateStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '2px dashed #d1d5db',
  };

  const sidebarStyle = {
    width: '320px',
    backgroundColor: 'white',
    borderLeft: '1px solid #e5e7eb',
    padding: '16px',
    overflowY: 'auto',
  };

  const sidebarHeaderStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
  };

  const sectionHeaderStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  };

  const cardStyle = {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '8px',
  };

  const smallButtonStyle = {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  };

  const deleteSmallButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
  };

  const doneSmallButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: '#6b7280',
    color: 'white',
  };

  const tipsStyle = {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '24px',
    padding: '12px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    lineHeight: '1.5',
  };

  return (
    <>
    <AdminNav/>
    <div style={containerStyle}>
      <div style={mainAreaStyle}>
        <div style={toolbarStyle}>
          <button
            onClick={addNode}
            style={primaryButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            + Add Step
          </button>
          
          <button
            onClick={clearWorkflow}
            style={dangerButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Clear All
          </button>
        </div>

        {nodes.length === 0 && (
          <div style={emptyStateStyle}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              Create Your Workflow
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Start by adding your first step</p>
            <button
              onClick={addNode}
              style={primaryButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              + Add First Step
            </button>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ backgroundColor: '#f9fafb' }}
        >
          <Controls style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
          <Background color="#e5e7eb" gap={20} />
        </ReactFlow>
      </div>

      <div style={sidebarStyle}>
        <h2 style={sidebarHeaderStyle}>Workflow Manager</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <h3 style={sectionHeaderStyle}>Steps ({nodes.length})</h3>
          <div>
            {nodes.map((node) => (
              <div key={node.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {node.data.label}
                    </h4>
                    {node.data.description && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        {node.data.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNode(node.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={sectionHeaderStyle}>Transitions ({edges.length})</h3>
          <div>
            {edges.map((edge) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              return (
                <div key={edge.id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#1f2937' }}>
                        {sourceNode?.data.label} → {targetNode?.data.label}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                        "{edge.label}"
                      </p>
                    </div>
                    <button
                      onClick={() => setEdges(eds => eds.filter(e => e.id !== edge.id))}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedEdge && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <h3 style={sectionHeaderStyle}>Edit Transition</h3>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                Label
              </label>
              <input
                type="text"
                value={selectedEdge.label}
                onChange={(e) => updateEdgeLabel(e.target.value)}
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={deleteEdge} style={deleteSmallButtonStyle}>
                  Delete
                </button>
                <button onClick={() => setSelectedEdge(null)} style={doneSmallButtonStyle}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={tipsStyle}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Tips:</p>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            <li>Click "Edit" on any step to modify it</li>
            <li>Drag from one step to another to create transitions</li>
            <li>Double-click transition lines to rename them quickly</li>
            <li>Click transitions in the sidebar to edit them</li>
            <li>Use "Remove" to delete steps or transitions</li>
          </ul>
        </div>
      </div>
    </div>
    </>

  );
}