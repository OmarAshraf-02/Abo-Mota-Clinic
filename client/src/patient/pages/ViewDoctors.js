import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFetchDoctorsQuery, useFetchPatientQuery } from "../../store";
import DoctorCard from "../components/DoctorCard";
import SearchBar from "../components/SearchBar";
import filter from "../utils/filter";
import filterSearch from "../functions/filterSearch";
import GeometrySkeleton from '../components/GeometrySkeleton';
import { Autocomplete, CircularProgress, FormControl, FormLabel, Box } from "@mui/joy";


function ViewDoctors() {
	const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
	const [config, setConfig] = useState({});

	const navigate = useNavigate();
	const { data, isFetching, error } = useFetchDoctorsQuery();
	const { data: patient, isFetching: isFetchingPatient, error: isFetchingPatientError } = useFetchPatientQuery();

	let content;
	let specialties = [];
	let discount;

	if (isFetching || isFetchingPatient) {
		content = undefined;
	} else if (error) {
		content = <div> Error ... </div>;
	} else {

		let filteredData = filter(data, config);
		filteredData = filterSearch(filteredData, doctorSearchTerm, ["name"]);
		// filteredData = filterSearch(filteredData, specialtySearchTerm, ["specialty"]);
		// discount = 20;
		if (patient.healthPackage) {
			discount = patient.healthPackage.package.doctorDiscount;
		} else {
			discount = undefined;
		}

		content =
			<>
				{filteredData.map((doctor) => {
					const handleRedirect = () => navigate('../doctorInfo', { state: doctor });
					return <DoctorCard className="cursor-pointer" onClick={handleRedirect} {...doctor} discount={discount} />;
				})}
			</>;

		specialties = [...new Set(data.map((doctor) => doctor.specialty))];
	}

	return (
		<div className="mt-5 ml-12 w-full">
			<Box className="header flex ml-16 mb-8 pr-10 space-x-5">
				<FormControl id="multiple-limit-tags">
					<FormLabel>Doctor name</FormLabel>
					<SearchBar placeholder="Search for doctors ..." onChange={(value) => setDoctorSearchTerm(value)} />
				</ FormControl>

				<FormControl id="multiple-limit-tags">
					<FormLabel>Specialties</FormLabel>
					<Autocomplete
						multiple
						id="tags-default"
						placeholder="Specialties"
						loading={isFetching}
						options={specialties}	
						endDecorator={
							isFetching ? (
								<CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
							) : null
						}
						limitTags={2}
						onChange={(event, newValue) => {
							setConfig({ ...config, specialty: newValue })
						}}
					/>
				</ FormControl>
			</Box>

			<div>
				{(isFetching || isFetchingPatient) && <GeometrySkeleton transition="pulse" />}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pr-20 pl-16 mb-5">
				{content}
			</div>
		</div>
	);
}

export default ViewDoctors;



