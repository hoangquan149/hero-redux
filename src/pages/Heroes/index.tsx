import _ from "lodash";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import Filter from "./components/Filter";
import BoxContentPage from "../../commons/components/BoxContentPage";
import Form from "./components/Form";
import Detail from "./components/Detail";
import Hero from "../../types/Hero";
import HeroSearch from "../../types/HeroSearch";
import { StorageService } from "../../services/StorageService";
import { add, save } from "../../stores/Hero/";
import { RootState } from "../../stores";
import "../../styles/pages/Heroes.scss";

export default function Heroes() {
   const heros = useSelector((state: RootState) => state.heros.heros);
   const dispatch = useDispatch();

   const [openForm, setOpenForm] = useState<boolean>(false);
   const [openDetail, setOpenDetail] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);

   const filterRef = useRef<Array<Hero>>([]);

   const detailHeroRef = useRef<Hero>();

   useEffect(() => {
      if (!_.isEmpty(filterRef.current)) return;
      StorageService.save(heros);
   }, [heros]);

   useEffect(() => {
      let timeout = setTimeout(() => {
         setLoading(false);
      }, 400);
      return () => clearTimeout(timeout);
   }, []);

   const onSearch = (params: HeroSearch) => {
      let newData: Hero[] = [];
      if (params && !params.name) {
         newData = StorageService.get();
         console.log(newData, "get");
         filterRef.current = [];
      } else {
         newData = [...heros].filter((hero, index) =>
            hero.name.includes(params.name.trim())
         );
         filterRef.current = newData;
      }
      dispatch(save(newData));
   };

   const addHero = (data: Hero) => {
      dispatch(add(data));
      filterRef.current = [];
   };

   const onOpenForm = (): void => {
      setOpenForm(true);
   };

   const closeOpenForm = (): void => {
      setOpenForm(false);
   };

   const onOpenDetail = (id: number): void => {
      const hero = [...heros].find((hero) => hero.id === id);
      detailHeroRef.current = hero;
      setOpenDetail(true);
   };

   const closeOpenDetail = (): void => {
      setOpenDetail(false);
   };

   const columns = [
      {
         field: "id",
         headerName: "ID",
         width: 70,
         renderCell: (params: any) => {
            return (
               <>
                  {params.value}
                  <Button
                     title="Chi tiết"
                     style={{
                        padding: 0,
                        minWidth: "unset",
                        height: "unset",
                        paddingLeft: 1,
                     }}
                     onClick={() => onOpenDetail(params.value)}
                  >
                     <InfoIcon />
                  </Button>
               </>
            );
         },
      },
      {
         field: "image",
         headerName: "Ảnh",
         renderCell: (params: any) => (
            <img
               style={{ width: 50, height: "100%", borderRadius: "100%" }}
               src={params?.value}
            />
         ),
         width: 100,
      },
      { field: "name", headerName: "Tên anh hùng", width: 200 },
      { field: "attack", headerName: "Tân công", width: 200 },
      { field: "defense", headerName: "Phòng thủ", width: 200 },
   ];

   return (
      <>
         <Filter onOpenForm={onOpenForm} onSearch={onSearch} />
         <BoxContentPage
            title={"Danh sách anh hùng"}
            className={"box-list-heroes"}
         >
            <div className={"box-content-heroes"}>
               <DataGrid
                  style={{ width: "100%" }}
                  loading={loading}
                  rows={heros}
                  columns={columns}
                  disableSelectionOnClick
                  hideFooter
                  rowsPerPageOptions={[]}
               />
            </div>
         </BoxContentPage>
         {openForm && (
            <Form
               openForm={openForm}
               closeOpenForm={closeOpenForm}
               addHero={addHero}
            />
         )}

         {openDetail && (
            <Detail
               openDetail={openDetail}
               closeOpenDetail={closeOpenDetail}
               heroDetail={detailHeroRef.current as Hero}
            />
         )}
      </>
   );
}
