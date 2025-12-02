import Header from "@/components/Header/Header";
import MyRoadmap from "@/components/StudentRoadmap/StudentRoadmap";

export default function Page() {
  return <>
    <div style={{zIndex: 50, position: "fixed", top: 0, left: 0, width:"100%"}} >
      <Header/>
    </div>
    <MyRoadmap/>
  </>;
}
