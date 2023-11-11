import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/joy/Divider";
import DoctorImg from "../assets/images/doctor.jpg";
import * as React from "react";
import { LuStethoscope, LuCalendarClock, LuBuilding } from "react-icons/lu";

import AppointmentScheduler from "./AppointmentScheduler";
import { AspectRatio, CardContent } from "@mui/joy";
import PaymentPage from "./PaymentPage";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../../shared/Components/LoadingIndicator";

import { useFetchDoctorsQuery, useFetchPatientQuery } from "../../store";

const steps = ["Schedule", "Appointment Overview", "Payment"];

export default function AppointmentStepper({ step = 0 }) {
  const [activeStep, setActiveStep] = useState(step);
  const { doctorId, id } = useParams();
  const [date, setDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [currentTimings, setCurrentTimings] = useState([]);

  const { data: doctor, isFetching: isFetchingDoctor, error: isFetchingDoctorError } = useFetchDoctorsQuery();
  const { data: patient, isFetching: isFetchingPatient, error: isFetchingPatientError } =
    useFetchPatientQuery();

  if (isFetchingDoctor || isFetchingPatient) {
    return <div>Loading ...</div>;
  } else if (isFetchingDoctorError || isFetchingPatientError) {
    return <div> Error ... </div>;
  }
  const { name, specialty, affiliation, rate } = doctor[id];

  const deductible = patient.healthPackage ? rate * 1.1 * (1 - patient.healthPackage.package.doctorDiscount) : rate * 1.1;

  const handleNext = () => {
    if (activeStep === 0 && !(date && currentTime)) return;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) return;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setDate(null);
    setAppointmentId(null);
    setCurrentTime(null);
    setCurrentTimings([]);
    setActiveStep(0);
  };

  const scheduling = (
    <AppointmentScheduler
      currentTimings={currentTimings}
      setCurrentTimings={setCurrentTimings}
      date={date}
      setDate={setDate}
      currentTime={currentTime}
      setCurrentTime={setCurrentTime}
      doctorId={doctorId}
      appointmentId={appointmentId}
      setAppointmentId={setAppointmentId}
    />
  );
  const payment = (
    <PaymentPage
      deductible={deductible}
      date={date}
      currentTime={currentTime}
      doctorId={doctorId}
      doctor={doctor[id]}
      patient={patient}
      doctorCredit={rate}
      appointmentId={appointmentId}
    />
  );

  const fn = (header, info) => {
    return (
      <Box>
        <Typography level="body-xs">{header}</Typography>
        <Typography level="title-md">{info}</Typography>
      </Box>
    );
  };

  const review = (
    <Box className="flex justify-between px-10">
      <Card className="">
        <Box className="flex w-full justify-center">
          {/* <AspectRatio
            className="flex"
            ratio="1"
            sx={{
              width: 100,
              borderRadius: '100%',
              bgcolor: 'background.level2',
              // borderRadius: 'md',
            }}>
            <img
              src={DoctorImg}
              loading="lazy"
              alt="Doctor"
            />
          </AspectRatio> */}
        </Box>
        <Box>
          <Typography level="title-md" sx={{ marginBottom: 1 }} startDecorator={<LuStethoscope />}>
            Doctor Details
          </Typography>

          <Divider sx={{ marginBottom: 1 }} />

          <Box className="space-y-1 mb-10">
            <Box className="flex space-x-5">
              <Typography level="body-sm" sx={{ width: 90 }}>
                Name
              </Typography>
              <Typography level="title-sm">Dr. {name}</Typography>
            </Box>

            <Box className="flex space-x-5">
              <Typography level="body-sm" sx={{ width: 90 }}>
                Specialty
              </Typography>
              <Typography level="title-sm">{specialty}</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            level="title-md"
            sx={{ marginBottom: 1 }}
            startDecorator={<LuCalendarClock />}
          >
            Date & Time
          </Typography>

          <Divider sx={{ marginBottom: 1 }} />

          <Box className="space-y-1 mb-10">
            <Box className="flex space-x-5">
              <Typography level="body-sm" sx={{ width: 90 }}>
                Date
              </Typography>
              <Typography level="title-sm">{date}</Typography>
            </Box>

            <Box className="flex space-x-5">
              <Typography level="body-sm" sx={{ width: 90 }}>
                Time
              </Typography>
              <Typography level="title-sm">{currentTime}</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography level="title-md" sx={{ marginBottom: 1 }} startDecorator={<LuBuilding />}>
            Location
          </Typography>

          <Divider sx={{ marginBottom: 1 }} />

          <Box className="flex space-x-5">
            <Typography level="body-sm" sx={{ width: 90 }}>
              Location
            </Typography>
            <Typography level="title-sm">{affiliation}</Typography>
          </Box>

          {/* <fn header="Location" info="Grey Sloan Memorial Hospital" /> */}
        </Box>
      </Card>

      <Divider orientation="vertical" />

      <Card className="" sx={{ width: "30%" }}>
        <Typography level="title-md">Payment Summary</Typography>

        <Divider />
        <Box>
          <Box className="flex justify-between">
            <Typography level="body-sm">Consultation</Typography>
            <Typography level="body-sm">${rate}</Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box className="flex justify-between">
            <Typography level="body-sm">Subtotal</Typography>
            <Typography level="body-sm">${rate}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography level="body-sm">Discount</Typography>
            <Typography level="body-sm" color="success">
              {" "}
              - $({rate - deductible})
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box className="flex justify-between">
            <Typography level="title-md">Total</Typography>
            <Typography level="title-md">${deductible}</Typography>
          </Box>

          <Box className="w-full" sx={{ marginTop: 15 }}>
            <Button className="w-full" variant="outlined">
              Proceed to Payment
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );

  const stepElements = [scheduling, review, payment];

  return (
    <Box sx={{ my: 5, mx: 5, width: "100%", py: 5, px: 20 }} className="">
      <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {stepElements[activeStep]}

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
}