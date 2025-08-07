<?php

namespace App\Http\Requests;

enum TimeUnit: string
{
  case DAY = 'day';
  case WEEK = 'week';
  case MONTH = 'month';
}

enum Frequency: string
{
  case ONCE_A_WEEK = 'once_a_week'; //mon
  case TWICE_A_WEEK = 'twice_a_week'; //tue, thu
  case EVERYDAY = 'everyday';
  case EVERY_OTHER_DAY = 'every_other_day' //mon, wed, fri
}
