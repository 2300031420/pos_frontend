"use client";

import Image from "next/image";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import { motion } from "framer-motion";

interface EventContentCardProps {
  title: string;
  des: string;
  panel: string;
  img: string;
}

export function EventContentCard({
  title,
  des,
  panel,
  img,
}: EventContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card
        color="transparent"
        shadow={false}
        className="lg:!flex-row mb-10 lg:items-end"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CardHeader
            floated={false}
            shadow={false}
            className="h-[32rem] max-w-[28rem] shrink-0 overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                width={768}
                height={768}
                src={img}
                alt="testimonial image"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </CardHeader>
        </motion.div>
        <CardBody className="col-span-full lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h6" color="blue-gray" className="mb-4">
              {panel}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography variant="h2" color="blue-gray" className="mb-4 font-medium">
              {title}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography className="mb-12 md:w-8/12 font-medium !text-gray-500">
              {des}
            </Typography>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default EventContentCard;
