import { Route, Routes } from "react-router-dom";
import React from "react";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import WorkflowManager from "../components/Workflow/WorkflowManager";
import AdminNav from "../components/navigation/Navigationbar";
import Style1 from "../components/Workflow/nodes/Style1";
import Style2 from "../components/Workflow/nodes/Style2";
import Style3 from "../components/Workflow/nodes/Style3";
import testpage from "../components/Workflow/nodes/test";
import TestPage from "../components/Workflow/nodes/test";


export default function MainRoute() {
  return (
    <Routes>
        <Route path="/" 
        element={
        <>
        <AdminNav/>
        <CreatePost/>
        <PostList/>
        </>} />   
        <Route path="/workflow" element={<WorkflowManager/>} />
        <Route path="/style1" element={<Style1/>} />
        <Route path="/style2" element={<Style2/>} />
        <Route path="/style3" element={<Style3/>} />
        <Route path="/test" element={<TestPage/>}/>
    </Routes>
  );
}