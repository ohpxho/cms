<?php

namespace App\Enums;

enum Frequency: string
{
    case ONCE_A_WEEK = 'once_a_week'; //mon
    case TWICE_A_WEEK = 'twice_a_week'; //tue, thu
    case EVERYDAY = 'everyday';
    case EVERY_OTHER_DAY = 'every_other_day'; //mon, wed, fri
}