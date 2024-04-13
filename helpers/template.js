import moment from "moment"

export default (content) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        ​
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket</title>
        </head>
        ​
        <body>
            <div bgcolor="#f6f6f6" style="color: #333; height: 100%; width: 100%;" height="100%" width="100%">
                <table bgcolor="#fefefe" cellspacing="0" style="border-collapse: collapse; padding: 40px; width: 100%;"
                    width="100%">
                    <tbody>
                        <tr>
                            <td width="5px" style="padding: 0;"></td>
                            <td
                                style="border: 1px solid #000;  clear: both; display: block; margin: 0 auto; max-width: 820px; padding: 0;">
                                <table cellspacing="0" style="border-collapse: collapse; margin: 0 auto; max-width: 820px;">
                                    <tbody style="max-width: 820px">
                                        <tr>
                                            <td valign="top" style="padding: 20px; min-width: 780px; width: 100%">
                                                <h3 style="
                                                        text-transform: uppercase;
                                                        color: #fff;
                                                        font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                        font-size: 18px;
                                                        font-weight: normal;
                                                        line-height: 1.2;
                                                        margin: 0;
                                                        margin-bottom: 15px;
                                                        background-color: #348eda;
                                                        padding: 8px 15px 4px;
                                                ">
                                                    Enquiry
                                                </h3>
                                                <table cellspacing="0"
                                                    style="border-collapse: collapse; width: 100%;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Name </td>
                                                            <td align="right" style="padding: 5px 0;">${content.firstName + '' + content.lastName} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Email </td>
                                                            <td align="right" style="padding: 5px 0;">${content.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Phone</td>
                                                            <td align="right" style="padding: 5px 0;">${content.phone}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Message</td>
                                                            <td align="right" style="padding: 5px 0;">${content.message}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </td>
                <td width="5px" style="padding: 0;"></td>
                </tr>
        ​
                </tbody>
                </table>
            </div>
        </body>
        ​
        </html>
    `
}

export const appointmentRequest = (content) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        ​
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket</title>
        </head>
        ​
        <body>
            <div bgcolor="#f6f6f6" style="color: #333; height: 100%; width: 100%;" height="100%" width="100%">
                <table bgcolor="#fefefe" cellspacing="0" style="border-collapse: collapse; padding: 40px; width: 100%;"
                    width="100%">
                    <tbody>
                        <tr>
                            <td width="5px" style="padding: 0;"></td>
                            <td
                                style="border: 1px solid #000;  clear: both; display: block; margin: 0 auto; max-width: 820px; padding: 0;">
                                <table cellspacing="0" style="border-collapse: collapse; margin: 0 auto; max-width: 820px;">
                                    <tbody style="max-width: 820px">
                                        <tr>
                                            <td valign="top" style="padding: 20px; min-width: 780px; width: 100%">
                                                <h3 style="
                                                        text-transform: uppercase;
                                                        color: #fff;
                                                        font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                        font-size: 18px;
                                                        font-weight: normal;
                                                        line-height: 1.2;
                                                        margin: 0;
                                                        margin-bottom: 15px;
                                                        background-color: #348eda;
                                                        padding: 8px 15px 4px;
                                                ">
                                                    Appointment Request
                                                </h3>
                                                <table cellspacing="0"
                                                    style="border-collapse: collapse; width: 100%;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Name </td>
                                                            <td align="right" style="padding: 5px 0;">${content.name} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Email </td>
                                                            <td align="right" style="padding: 5px 0;">${content.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Date</td>
                                                            <td align="right" style="padding: 5px 0;">${moment(content.date).format('DD/MM/YYYY') }</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Time</td>
                                                            <td align="right" style="padding: 5px 0;">${content.time}</td>
                                                        </tr>
                                                         <tr>
                                                            <td style="padding: 5px 0;">Department</td>
                                                            <td align="right" style="padding: 5px 0;">${content.department}</td>
                                                        </tr>
                                                         <tr>
                                                            <td style="padding: 5px 0;">Doctor</td>
                                                            <td align="right" style="padding: 5px 0;">${content.doctor}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </td>
                <td width="5px" style="padding: 0;"></td>
                </tr>

                </tbody>
                </table>
            </div>
        </body>

        </html>
    `
}

export const appointmentStatus = (content) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        ​
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket</title>
        </head>
        ​
        <body>
            <div bgcolor="#f6f6f6" style="color: #333; height: 100%; width: 100%;" height="100%" width="100%">
                <table bgcolor="#fefefe" cellspacing="0" style="border-collapse: collapse; padding: 40px; width: 100%;"
                    width="100%">
                    <tbody>
                        <tr>
                            <td width="5px" style="padding: 0;"></td>
                            <td
                                style="border: 1px solid #000;  clear: both; display: block; margin: 0 auto; max-width: 820px; padding: 0;">
                                <table cellspacing="0" style="border-collapse: collapse; margin: 0 auto; max-width: 820px;">
                                    <tbody style="max-width: 820px">
                                        <tr>
                                            <td valign="top" style="padding: 20px; min-width: 780px; width: 100%">
                                                <h3 style="
                                                        text-transform: uppercase;
                                                        color: #fff;
                                                        font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                        font-size: 18px;
                                                        font-weight: normal;
                                                        line-height: 1.2;
                                                        margin: 0;
                                                        margin-bottom: 15px;
                                                        background-color: #348eda;
                                                        padding: 8px 15px 4px;
                                                ">
                                                    Appointment Status Changed
                                                </h3>
                                                <table cellspacing="0"
                                                    style="border-collapse: collapse; width: 100%;">
                                                    <tbody>
                                                     <tr>
                                                            <td style="padding: 5px 0;">Id </td>
                                                            <td align="right" style="padding: 5px 0;">${content._id} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Name </td>
                                                            <td align="right" style="padding: 5px 0;">${content.name} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Email </td>
                                                            <td align="right" style="padding: 5px 0;">${content.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Date</td>
                                                            <td align="right" style="padding: 5px 0;">${moment(content.date).format('DD/MM/YYYY') }</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 5px 0;">Time</td>
                                                            <td align="right" style="padding: 5px 0;">${content.time}</td>
                                                        </tr>
                                                         <tr>
                                                            <td style="padding: 5px 0;">Department</td>
                                                            <td align="right" style="padding: 5px 0;">${content.department}</td>
                                                        </tr>
                                                         <tr>
                                                            <td style="padding: 5px 0;">Doctor</td>
                                                            <td align="right" style="padding: 5px 0;">${content.doctor}</td>
                                                        </tr>
                                                         <tr>
                                                            <td style="padding: 5px 0;">Status</td>
                                                            <td align="right" style="padding: 5px 0;">${content.status}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </td>
                <td width="5px" style="padding: 0;"></td>
                </tr>

                </tbody>
                </table>
            </div>
        </body>

        </html>
    `
}
