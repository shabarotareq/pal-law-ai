import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";

const FeatureCard = ({ title, description }) => {
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="default">تجربة</Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
